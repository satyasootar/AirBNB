import React, { useContext, useMemo, useState, useRef, useCallback, useEffect } from "react";
import { StoreContext } from "../context/StoreContext";

export default function Dashboard() {
  const {
    users = [],
    logout,
    setUsers,
    userLoading,
    deleteUser,
    totalUser = 0,
    listings = [],
    setListings,
    deleteListing,
    totalListings = 0,
    fetchMoreListings,
    fetchMoreUsers,
    hasMoreUsers,
    hasMoreListings,
    isLoadingMoreUsers,
    isLoadingMoreListings,
    bookings = [],
  } = useContext(StoreContext);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [confirm, setConfirm] = useState({ open: false, type: null, id: null });
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  // Detail surface states
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedListing, setSelectedListing] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Charts state
  const [chartMode, setChartMode] = useState("daily");
  const [yearFilter, setYearFilter] = useState("all");

  // Refs
  const usersContainerRef = useRef(null);
  const listingsContainerRef = useRef(null);
  const bookingsContainerRef = useRef(null);
  const searchInputRef = useRef(null);

  /* ----------------------------- Helpers ----------------------------- */
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
    } catch (error) {
      return dateString;
    }
  };

  const getRoleDisplay = (role) => (role === "HO" ? "Host" : "Guest");
  const formatPrice = (price) => new Intl.NumberFormat("en-IN").format(Number(price || 0));

  const roleStats = useMemo(() => ({
    hosts: users.filter((u) => u.role === "HO").length,
    guests: users.filter((u) => u.role === "GU").length,
  }), [users]);

  const totalRevenueFromBookings = useMemo(() => 
    bookings.reduce((s, b) => s + Number(b?.payment?.amount || b?.total_price || 0), 0), 
    [bookings]
  );

  const stats = useMemo(() => ({
    users: users.length,
    listings: listings.length,
    bookings: bookings.length,
    hosts: roleStats.hosts,
    guests: roleStats.guests,
    totalRevenue: totalRevenueFromBookings,
  }), [users.length, listings.length, bookings.length, roleStats.hosts, roleStats.guests, totalRevenueFromBookings]);

  const filteredUsers = useMemo(() => users.filter((user) => {
    const searchString = (user.username + (user.email || "") + getRoleDisplay(user.role)).toLowerCase();
    return searchString.includes(search.toLowerCase());
  }), [users, search]);

  const filteredListings = useMemo(() => listings.filter((l) => {
    const searchString = ((l.title || "") + (l.host?.username || "") + (l.location?.city || "") + (l.location?.state || "")).toLowerCase();
    return searchString.includes(search.toLowerCase());
  }), [listings, search]);

  const filteredBookings = useMemo(() => {
    const s = search.toLowerCase();
    return bookings.filter((b) => {
      const hotelTitle = b?.listing_info?.title || "";
      const username = b?.user?.username || "";
      const email = b?.user?.email || "";
      const status = b?.status || "";
      const idStr = String(b?.id || "");
      return (
        hotelTitle.toLowerCase().includes(s) ||
        username.toLowerCase().includes(s) ||
        email.toLowerCase().includes(s) ||
        status.toLowerCase().includes(s) ||
        idStr.includes(s)
      );
    });
  }, [bookings, search]);

  const isLoading = userLoading || loading;

  /* -------------------------- Delete handlers ------------------------- */
  const handleDeleteUser = async (id) => {
    const originalUsers = [...users];
    setUsers((prev) => prev.filter((u) => u.id !== id));
    try {
      await deleteUser(id);
      showToast("User deleted successfully");
    } catch (error) {
      setUsers(originalUsers);
      showToast("Failed to delete user");
    }
  };

  const handleDeleteListing = async (id) => {
    const originalListings = [...listings];
    setListings((prev) => prev.filter((l) => l.id !== id));
    setLoading(true);
    try {
      await deleteListing(id);
      showToast("Listing deleted successfully");
    } catch (error) {
      setListings(originalListings);
      showToast("Failed to delete listing");
    } finally {
      setLoading(false);
    }
  };

  const showToast = useCallback((text) => {
    setMessage(text);
    setTimeout(() => setMessage(null), 3000);
  }, []);

  const confirmDelete = (type, id) => {
    setConfirm({ open: true, type, id });
  };

  const cancelConfirm = () => {
    setConfirm({ open: false, type: null, id: null });
  };

  const runConfirm = () => {
    if (confirm.type === "user") handleDeleteUser(confirm.id);
    if (confirm.type === "listing") handleDeleteListing(confirm.id);
    cancelConfirm();
  };

  /* --------------------------- Infinite scroll --------------------------- */
  const handleUsersScroll = useCallback((e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollHeight - scrollTop <= clientHeight * 1.2 && hasMoreUsers && !isLoadingMoreUsers && !userLoading) {
      fetchMoreUsers();
    }
  }, [hasMoreUsers, isLoadingMoreUsers, userLoading, fetchMoreUsers]);

  const handleListingsScroll = useCallback((e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollHeight - scrollTop <= clientHeight * 1.2 && hasMoreListings && !isLoadingMoreListings && !loading) {
      fetchMoreListings();
    }
  }, [hasMoreListings, isLoadingMoreListings, loading, fetchMoreListings]);

  /* ------------------------------ Analytics ------------------------------ */
  const derived = useMemo(() => buildAnalytics(bookings), [bookings]);
  const years = useMemo(() => ["all", ...Object.keys(derived.byYear).sort()], [derived.byYear]);

  const dailySeries = derived.daily;
  const monthlySeries = useMemo(() => {
    if (yearFilter === "all") return derived.byMonthAllYears;
    return derived.byMonthByYear[yearFilter] || [];
  }, [derived.byMonthAllYears, derived.byMonthByYear, yearFilter]);
  const yearlySeries = derived.yearly;

  const peakDaily = maxItem(dailySeries, "count");
  const peakMonthly = maxItem(monthlySeries, "count");
  const peakYearly = maxItem(yearlySeries, "count");

  // Focus search when typing anywhere
  useEffect(() => {
    const handleKeyPress = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Modern Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-500">Manage your platform efficiently</p>
              </div>
            </div>

            {/* Enhanced Search */}
            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <input
                  ref={searchInputRef}
                  className="w-full bg-gray-100 border-0 rounded-xl px-4 py-3 pl-12 text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
                  placeholder="Search users, listings, bookings... (Ctrl+K)"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <SearchIcon className="w-5 h-5" />
                </div>
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => logout?.()}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              >
                <LogoutIcon className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-8 mt-6 border-b">
            {[
              { id: "overview", label: "Overview" },
              { id: "users", label: "Users" },
              { id: "listings", label: "Listings" },
              { id: "bookings", label: "Bookings" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-4 px-1 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Toast Notification */}
        {message && (
          <div className="fixed top-20 right-6 z-50 p-4 rounded-xl bg-emerald-500 text-white shadow-lg flex items-center justify-between min-w-80 animate-slide-in">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                ✓
              </div>
              <span className="font-medium">{message}</span>
            </div>
            <button onClick={() => setMessage(null)} className="text-white/80 hover:text-white">
              ✕
            </button>
          </div>
        )}

        {/* Search Results Summary */}
        {search && (
          <div className="mb-6 p-4 bg-white rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">Search Results</h3>
                <p className="text-sm text-gray-600">
                  Found {filteredUsers.length} users, {filteredListings.length} listings, and {filteredBookings.length} bookings for "{search}"
                </p>
              </div>
              <button
                onClick={() => setSearch("")}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                Clear search
              </button>
            </div>
          </div>
        )}

        {/* Overview Tab Content */}
        {activeTab === "overview" && (
          <>
            {/* Stat Cards */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard 
                title="Total Users" 
                value={stats.users} 
                subtitle="Registered accounts" 
                icon={<UsersIcon />}
                trend={{ value: 12, positive: true }}
              />
              <StatCard 
                title="Active Listings" 
                value={stats.listings} 
                subtitle="Available properties" 
                icon={<HomeIcon />}
                trend={{ value: 8, positive: true }}
              />
              <StatCard 
                title="Total Bookings" 
                value={stats.bookings} 
                subtitle="Reservations made" 
                icon={<CalendarIcon />}
                trend={{ value: 5, positive: true }}
              />
              <StatCard 
                title="Total Revenue" 
                value={`₹${formatPrice(stats.totalRevenue)}`} 
                subtitle="All-time earnings" 
                icon={<CurrencyIcon />}
                trend={{ value: 15, positive: true }}
                accent
              />
            </section>

            {/* Analytics Hub */}
            <section className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
              <div className="xl:col-span-2 bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Booking Analytics</h3>
                    <p className="text-sm text-gray-600">Track booking trends over time</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Segmented 
                      value={chartMode} 
                      onChange={setChartMode} 
                      options={[
                        { label: "Daily", value: "daily" },
                        { label: "Monthly", value: "monthly" },
                        { label: "Yearly", value: "yearly" }
                      ]} 
                    />
                    {chartMode === "monthly" && (
                      <select 
                        value={yearFilter} 
                        onChange={(e) => setYearFilter(e.target.value)}
                        className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        {years.map((year) => (
                          <option key={year} value={year}>
                            {year === "all" ? "All Years" : year}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>

                <div className="h-80">
                  {chartMode === "daily" && <EnhancedLineChart data={dailySeries} xKey="date" yKey="count" />}
                  {chartMode === "monthly" && <EnhancedBarChart data={monthlySeries} xKey="label" yKey="count" />}
                  {chartMode === "yearly" && <EnhancedBarChart data={yearlySeries} xKey="year" yKey="count" />}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-1">Peak Day</div>
                    <div className="font-semibold text-gray-900">
                      {peakDaily ? `${peakDaily.date} (${peakDaily.count})` : "No data"}
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-1">Peak Month</div>
                    <div className="font-semibold text-gray-900">
                      {peakMonthly ? `${peakMonthly.label} (${peakMonthly.count})` : "No data"}
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-1">Peak Year</div>
                    <div className="font-semibold text-gray-900">
                      {peakYearly ? `${peakYearly.year} (${peakYearly.count})` : "No data"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Status</h3>
                  <EnhancedDonutChart data={derived.statusCounts} labelKey="status" valueKey="count" />
                </div>
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h3>
                  <EnhancedDonutChart data={derived.paymentMethodCounts} labelKey="method" valueKey="count" />
                </div>
              </div>
            </section>

            {/* Secondary Analytics */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Cities</h3>
                <EnhancedHorizontalBar data={topCitiesFromListings(listings)} labelKey="city" valueKey="count" />
              </div>
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Revenue</h3>
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {bookings.slice(0, 10).map((b) => (
                    <div key={b.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <CurrencyIcon className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">#{b.id}</div>
                          <div className="text-xs text-gray-500">{b?.listing_info?.title}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-gray-900">
                          ₹{formatPrice(b?.payment?.amount || b?.total_price || 0)}
                        </div>
                        <div className="text-xs text-gray-500">{formatDate(b?.created_at)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}

        {/* Users Tab Content */}
        {activeTab === "users" && (
          <DataTable
            title="Users Management"
            data={filteredUsers}
            loading={userLoading && users.length === 0}
            search={search}
            type="users"
            onScroll={handleUsersScroll}
            containerRef={usersContainerRef}
            onView={(user) => setSelectedUser(user)}
            onDelete={(user) => confirmDelete("user", user.id)}
            isLoadingMore={isLoadingMoreUsers}
            hasMore={hasMoreUsers}
            columns={[
              { key: "user", label: "User", width: "30%" },
              { key: "role", label: "Role", width: "20%" },
              { key: "joined", label: "Joined", width: "25%" },
              { key: "actions", label: "Actions", width: "25%" },
            ]}
            renderRow={(user) => ({
              user: (
                <div className="flex items-center gap-3">
                  <Avatar src={user.profile_pic} initial={user.username?.[0]} alt={user.username} />
                  <div>
                    <div className="font-medium text-gray-900">{user.username}</div>
                    <div className="text-sm text-gray-500">{user.email || "No email"}</div>
                  </div>
                </div>
              ),
              role: <RoleBadge role={user.role} />,
              joined: <div className="text-sm text-gray-600">{formatDate(user.date_joined)}</div>,
              actions: (
                <div className="flex items-center gap-2">
                  <IconButton title="View details" onClick={() => setSelectedUser(user)} icon={EyeIcon} />
                  <IconButton title="Delete user" onClick={() => confirmDelete("user", user.id)} icon={TrashIcon} danger />
                </div>
              ),
            })}
          />
        )}

        {/* Listings Tab Content */}
        {activeTab === "listings" && (
          <DataTable
            title="Listings Management"
            data={filteredListings}
            loading={userLoading && listings.length === 0}
            search={search}
            type="listings"
            onScroll={handleListingsScroll}
            containerRef={listingsContainerRef}
            onView={(listing) => setSelectedListing(listing)}
            onDelete={(listing) => confirmDelete("listing", listing.id)}
            isLoadingMore={isLoadingMoreListings}
            hasMore={hasMoreListings}
            columns={[
              { key: "property", label: "Property", width: "30%" },
              { key: "location", label: "Location", width: "25%" },
              { key: "price", label: "Price/Night", width: "20%" },
              { key: "actions", label: "Actions", width: "25%" },
            ]}
            renderRow={(listing) => ({
              property: (
                <div className="flex items-center gap-3">
                  <ImageThumb src={listing.images?.[0]?.url} alt={listing.title} fallbackIcon="🏠" />
                  <div>
                    <div className="font-medium text-gray-900 line-clamp-1">{listing.title}</div>
                    <div className="text-sm text-gray-500">{listing.host?.username || "Unknown host"}</div>
                  </div>
                </div>
              ),
              location: (
                <div>
                  <div className="text-sm text-gray-900">{listing.location?.city || "Unknown"}</div>
                  <div className="text-xs text-gray-500">{listing.location?.state || ""}</div>
                </div>
              ),
              price: (
                <div>
                  <div className="font-semibold text-gray-900">₹{formatPrice(listing.price_per_night)}</div>
                  <div className="text-xs text-gray-500">per night</div>
                </div>
              ),
              actions: (
                <div className="flex items-center gap-2">
                  <IconButton title="View details" onClick={() => setSelectedListing(listing)} icon={EyeIcon} />
                  <IconButton title="Delete listing" onClick={() => confirmDelete("listing", listing.id)} icon={TrashIcon} danger />
                </div>
              ),
            })}
          />
        )}

        {/* Bookings Tab Content */}
        {activeTab === "bookings" && (
          <DataTable
            title="Bookings Management"
            data={filteredBookings}
            loading={bookings.length === 0}
            search={search}
            type="bookings"
            containerRef={bookingsContainerRef}
            onView={(booking) => setSelectedBooking(booking)}
            columns={[
              { key: "booking", label: "Booking", width: "10%" },
              { key: "guest", label: "Guest", width: "15%" },
              { key: "hotel", label: "Hotel", width: "20%" },
              { key: "dates", label: "Dates", width: "15%" },
              { key: "nights", label: "Nights", width: "10%" },
              { key: "amount", label: "Amount", width: "15%" },
              { key: "status", label: "Status", width: "10%" },
              { key: "actions", label: "Actions", width: "5%" },
            ]}
            renderRow={(booking) => ({
              booking: <div className="font-medium text-gray-900">#{booking.id}</div>,
              guest: (
                <div>
                  <div className="font-medium text-gray-900">{booking.user?.username}</div>
                  <div className="text-sm text-gray-500">{booking.user?.email}</div>
                </div>
              ),
              hotel: (
                <div>
                  <div className="font-medium text-gray-900 line-clamp-1">{booking.listing_info?.title}</div>
                  <div className="text-sm text-gray-500 line-clamp-1">{booking.listing_info?.address}</div>
                </div>
              ),
              dates: (
                <div className="text-sm text-gray-600">
                  <div>{formatDate(booking.check_in)}</div>
                  <div>→ {formatDate(booking.check_out)}</div>
                </div>
              ),
              nights: <div className="text-sm text-gray-900">{booking.nights}</div>,
              amount: (
                <div className="font-semibold text-gray-900">
                  ₹{formatPrice(booking?.payment?.amount || booking?.total_price || 0)}
                </div>
              ),
              status: <StatusBadge status={booking.status} />,
              actions: <IconButton title="View booking" onClick={() => setSelectedBooking(booking)} icon={EyeIcon} />,
            })}
          />
        )}
      </main>

      {/* Modern Modal for Delete Confirmation */}
      {confirm.open && (
        <ModernModal onClose={cancelConfirm}>
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <ExclamationIcon className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Confirm Deletion</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this {confirm.type}? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={cancelConfirm}
                className="px-6 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={runConfirm}
                className="px-6 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium"
              >
                Delete {confirm.type}
              </button>
            </div>
          </div>
        </ModernModal>
      )}

      {/* Detail Drawers */}
      {selectedUser && <UserDrawer user={selectedUser} onClose={() => setSelectedUser(null)} />}
      {selectedListing && <ListingDrawer listing={selectedListing} onClose={() => setSelectedListing(null)} />}
      {selectedBooking && <BookingDrawer booking={selectedBooking} onClose={() => setSelectedBooking(null)} />}
    </div>
  );
}

/* ---------------------------- Enhanced Components --------------------------- */

// Modern Modal Component
function ModernModal({ children, onClose }) {
  useEffect(() => {
    const onEsc = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-6 mx-4 max-w-md w-full shadow-2xl transform animate-scale-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}

// Enhanced Data Table Component
function DataTable({
  title,
  data,
  loading,
  search,
  type,
  onScroll,
  containerRef,
  onView,
  onDelete,
  isLoadingMore,
  hasMore,
  columns,
  renderRow,
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border">
      <div className="p-6 border-b">
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600 mt-1">
          {data.length} {type} found
          {search && ` for "${search}"`}
        </p>
      </div>
      
      <div 
        ref={containerRef}
        onScroll={onScroll}
        className="overflow-x-auto"
        style={{ maxHeight: '600px' }}
      >
        <table className="w-full">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="text-left py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider"
                  style={{ width: column.width }}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <SkeletonRows count={8} columns={columns.length} />
            ) : data.length === 0 ? (
              <EmptyRow 
                colSpan={columns.length} 
                icon={type === 'users' ? '👤' : type === 'listings' ? '🏠' : '📋'}
                title={`No ${type} found`}
                subtitle={search ? "Try adjusting your search" : null}
              />
            ) : (
              <>
                {data.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    {columns.map((column) => (
                      <td key={column.key} className="py-4 px-6">
                        {renderRow(item)[column.key]}
                      </td>
                    ))}
                  </tr>
                ))}
                {isLoadingMore && <LoadingRow colSpan={columns.length} text={`Loading more ${type}...`} />}
                {!hasMore && data.length > 0 && <EndRow colSpan={columns.length} text={`No more ${type} to load`} />}
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Enhanced Stat Card with trends
function StatCard({ title, value, subtitle, icon, trend, accent = false }) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border p-6 ${accent ? 'border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50' : ''}`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${accent ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
          {icon}
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm font-medium ${
            trend.positive ? 'text-green-600' : 'text-red-600'
          }`}>
            {trend.positive ? '↑' : '↓'} {trend.value}%
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-sm text-gray-600">{subtitle}</div>
    </div>
  );
}

/* --------------------------- SkeletonRows Helper --------------------------- */
function SkeletonRows({ count = 8, columns = 4 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, rowIndex) => (
        <tr key={rowIndex} className="animate-pulse">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <td key={colIndex} className="py-4 px-6">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

/* --------------------------- Table Helper Rows --------------------------- */

function EmptyRow({ colSpan = 1, icon = "📄", title = "No data", subtitle = null }) {
  return (
    <tr>
      <td colSpan={colSpan} className="py-10 px-6">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-2xl mb-3">
            <span className="select-none">{icon}</span>
          </div>
          <div className="text-sm font-medium text-gray-900">{title}</div>
          {subtitle && <div className="text-xs text-gray-500 mt-1">{subtitle}</div>}
        </div>
      </td>
    </tr>
  );
}

function LoadingRow({ colSpan = 1, text = "Loading..." }) {
  return (
    <tr>
      <td colSpan={colSpan} className="py-6 px-6">
        <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
          <span className="inline-block h-5 w-5 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
          <span>{text}</span>
        </div>
      </td>
    </tr>
  );
}

function EndRow({ colSpan = 1, text = "No more items" }) {
  return (
    <tr>
      <td colSpan={colSpan} className="py-5 px-6">
        <div className="text-center text-xs text-gray-500">{text}</div>
      </td>
    </tr>
  );
}

/* --------------------------- StatusBadge Helper --------------------------- */

function StatusBadge({ status = "" }) {
  const normalized = status.toLowerCase();

  const statusStyles = {
    confirmed: "bg-emerald-100 text-emerald-700 border-emerald-200",
    completed: "bg-blue-100 text-blue-700 border-blue-200",
    pending: "bg-amber-100 text-amber-700 border-amber-200",
    cancelled: "bg-rose-100 text-rose-700 border-rose-200",
    failed: "bg-red-100 text-red-700 border-red-200",
    refunded: "bg-indigo-100 text-indigo-700 border-indigo-200",
    default: "bg-gray-100 text-gray-700 border-gray-200",
  };

  const style = statusStyles[normalized] || statusStyles.default;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${style}`}
    >
      <span
        className={`w-2 h-2 rounded-full ${
          style.includes("emerald") ? "bg-emerald-500" :
          style.includes("blue") ? "bg-blue-500" :
          style.includes("amber") ? "bg-amber-500" :
          style.includes("rose") ? "bg-rose-500" :
          style.includes("indigo") ? "bg-indigo-500" :
          "bg-gray-400"
        }`}
      ></span>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

/* --------------------------- Avatar Helper --------------------------- */

function Avatar({ src, alt = "User", initial = "?", size = "md" }) {
  const sizeClasses = {
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-14 h-14 text-lg",
  };

  return (
    <div
      className={`relative rounded-full overflow-hidden bg-gray-200 flex items-center justify-center font-semibold text-gray-700 ${sizeClasses[size]}`}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.style.display = "none";
          }}
        />
      ) : (
        <span>{initial?.toUpperCase() || "?"}</span>
      )}
    </div>
  );
}


/* --------------------------- RoleBadge Helper --------------------------- */

function RoleBadge({ role = "" }) {
  const normalized = role.toUpperCase();

  const roleStyles = {
    HO: "bg-indigo-100 text-indigo-700 border-indigo-200", // Host
    GU: "bg-pink-100 text-pink-700 border-pink-200",       // Guest
    AD: "bg-amber-100 text-amber-700 border-amber-200",    // Admin (if any)
    default: "bg-gray-100 text-gray-700 border-gray-200",
  };

  const label =
    normalized === "HO"
      ? "Host"
      : normalized === "GU"
      ? "Guest"
      : normalized === "AD"
      ? "Admin"
      : "User";

  const style = roleStyles[normalized] || roleStyles.default;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${style}`}
    >
      <span
        className={`w-2 h-2 rounded-full ${
          style.includes("indigo")
            ? "bg-indigo-500"
            : style.includes("pink")
            ? "bg-pink-500"
            : style.includes("amber")
            ? "bg-amber-500"
            : "bg-gray-400"
        }`}
      ></span>
      {label}
    </span>
  );
}


// Enhanced Chart Components
function EnhancedLineChart({ data = [], xKey, yKey }) {
  if (!data.length) return <EmptyChart />;
  
  return (
    <div className="h-full w-full">
      <div className="text-sm text-gray-500 mb-4">Bookings over time</div>
      <div className="relative h-64">
        {/* Simplified chart implementation - in real app, use a chart library */}
        <div className="flex items-end justify-between h-48 gap-1">
          {data.slice(-14).map((item, index) => {
            const maxVal = Math.max(...data.map(d => d[yKey]));
            const height = ((item[yKey] || 0) / maxVal) * 100;
            return (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t transition-all duration-300 hover:from-blue-600 hover:to-blue-500"
                  style={{ height: `${Math.max(height, 5)}%` }}
                />
                <div className="text-xs text-gray-500 mt-2 truncate w-full text-center">
                  {item[xKey]?.split('-').slice(1).join('/')}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function EnhancedBarChart({ data = [], xKey, yKey }) {
  if (!data.length) return <EmptyChart />;
  
  return (
    <div className="h-full w-full">
      <div className="text-sm text-gray-500 mb-4">Bookings distribution</div>
      <div className="relative h-64">
        <div className="flex items-end justify-between h-48 gap-2">
          {data.map((item, index) => {
            const maxVal = Math.max(...data.map(d => d[yKey]));
            const height = ((item[yKey] || 0) / maxVal) * 100;
            return (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-gradient-to-t from-green-500 to-green-400 rounded-t transition-all duration-300 hover:from-green-600 hover:to-green-500"
                  style={{ height: `${Math.max(height, 5)}%` }}
                />
                <div className="text-xs text-gray-500 mt-2 truncate w-full text-center">
                  {String(item[xKey]).slice(0, 3)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function EnhancedDonutChart({ data = [], labelKey, valueKey }) {
  const total = data.reduce((sum, item) => sum + (item[valueKey] || 0), 0);
  const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];

  return (
    <div className="flex items-center justify-center">
      <div className="relative w-48 h-48">
        <svg viewBox="0 0 100 100" className="transform -rotate-90">
          {data.reduce((acc, item, index) => {
            const value = (item[valueKey] || 0) / total;
            const start = acc;
            const end = start + value;
            const largeArc = value > 0.5 ? 1 : 0;
            
            const startX = 50 + 40 * Math.cos(2 * Math.PI * start);
            const startY = 50 + 40 * Math.sin(2 * Math.PI * start);
            const endX = 50 + 40 * Math.cos(2 * Math.PI * end);
            const endY = 50 + 40 * Math.sin(2 * Math.PI * end);
            
            const path = `M 50 50 L ${startX} ${startY} A 40 40 0 ${largeArc} 1 ${endX} ${endY} Z`;
            
            return (
              <g key={index}>
                <path d={path} fill={colors[index % colors.length]} />
              </g>
            );
          }, 0)}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{total}</div>
            <div className="text-xs text-gray-500">Total</div>
          </div>
        </div>
      </div>
      <div className="ml-6 space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: colors[index % colors.length] }}
            />
            <span className="text-gray-700">{item[labelKey]}</span>
            <span className="ml-auto font-medium">{item[valueKey]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function EnhancedHorizontalBar({ data = [], labelKey, valueKey }) {
  const maxVal = Math.max(...data.map(item => item[valueKey] || 0));

  return (
    <div className="space-y-4">
      {data.map((item, index) => {
        const width = ((item[valueKey] || 0) / maxVal) * 100;
        return (
          <div key={index} className="flex items-center gap-4">
            <div className="w-24 text-sm font-medium text-gray-700 truncate">
              {item[labelKey]}
            </div>
            <div className="flex-1">
              <div className="h-8 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                  style={{ width: `${width}%` }}
                />
              </div>
            </div>
            <div className="w-12 text-sm font-semibold text-gray-900 text-right">
              {item[valueKey]}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function EmptyChart() {
  return (
    <div className="h-64 flex items-center justify-center text-gray-500">
      <div className="text-center">
        <div className="text-4xl mb-2">📊</div>
        <div>No data available</div>
      </div>
    </div>
  );
}

/* --------------------------- Keep existing helper components --------------------------- */

// Keep all your existing helper components like:
// Avatar, ImageThumb, RoleBadge, StatusBadge, IconButton, Drawer components, etc.
// But update the Drawer to use the modern styling

// Update the Drawer component to be more modern
function Drawer({ children, onClose, title, subtitle }) {
  useEffect(() => { 
    const onEsc = (e) => e.key === "Escape" && onClose?.(); 
    window.addEventListener("keydown", onEsc); 
    return () => window.removeEventListener("keydown", onEsc); 
  }, [onClose]);
  
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/30" onClick={onClose}></div>
      <div className="absolute top-0 right-0 h-full w-full sm:w-96 bg-white shadow-xl p-0 overflow-y-auto rounded-l-xl">
        <div className="p-6 border-b bg-white sticky top-0">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-lg font-semibold text-gray-900">{title}</div>
              {subtitle && <div className="text-sm text-gray-500 mt-1">{subtitle}</div>}
            </div>
            <button 
              onClick={onClose} 
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

// Update Segmented Control
function Segmented({ value, onChange, options }) {
  return (
    <div className="inline-flex bg-gray-100 rounded-lg p-1 border">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-4 py-2 text-sm rounded-md transition-all ${
            value === opt.value 
              ? "bg-white shadow-sm border text-gray-900 font-medium" 
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function buildAnalytics(bookings = []) {
  const dailyMap = new Map();
  const byMonthByYear = {};
  const byYear = {};
  const statusCounts = {};
  const paymentMethodCounts = {};

  const monthAgg = new Map();
  const yearMap = new Map();

  bookings.forEach((b) => {
    const createdISO = (b?.created_at || "").slice(0, 10); // YYYY-MM-DD
    if (createdISO) {
      // Daily
      dailyMap.set(createdISO, (dailyMap.get(createdISO) || 0) + 1);

      // Monthly
      const [y, m] = createdISO.split("-").map(Number);
      const ym = `${y}-${String(m).padStart(2, "0")}`;
      monthAgg.set(ym, (monthAgg.get(ym) || 0) + 1);

      // Yearly
      yearMap.set(y, (yearMap.get(y) || 0) + 1);
    }

    // Status count
    const status = b?.status || "unknown";
    statusCounts[status] = (statusCounts[status] || 0) + 1;

    // Payment methods
    const method = b?.payment?.payment_method || "other";
    paymentMethodCounts[method] = (paymentMethodCounts[method] || 0) + 1;
  });

  // Convert to arrays
  const daily = Array.from(dailyMap.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([date, count]) => ({ date, count }));

  const yearly = Array.from(yearMap.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([year, count]) => ({ year, count }));

  yearly.forEach(({ year, count }) => {
    byYear[year] = count;
  });

  // Monthly grouped by year
  const byMonthAllYearsTmp = [];
  const monthMapPerYear = {};

  Array.from(monthAgg.entries()).forEach(([ym, count]) => {
    const [y, m] = ym.split("-").map(Number);
    const label = `${monthName(m)} ${y}`;
    byMonthAllYearsTmp.push({ label, count, _key: ym });
    if (!monthMapPerYear[y]) monthMapPerYear[y] = new Map();
    monthMapPerYear[y].set(m, count);
  });

  Object.keys(monthMapPerYear).forEach((y) => {
    const arr = [];
    for (let m = 1; m <= 12; m++) {
      const cnt = monthMapPerYear[y].get(m) || 0;
      arr.push({ label: `${monthName(m)} ${y}`, month: monthName(m), count: cnt });
    }
    byMonthByYear[y] = arr;
  });

  const byMonthAllYears = byMonthAllYearsTmp
    .sort((a, b) => a._key.localeCompare(b._key))
    .map(({ _key, ...rest }) => rest);

  const statusArr = Object.entries(statusCounts).map(([status, count]) => ({ status, count }));
  const paymentArr = Object.entries(paymentMethodCounts).map(([method, count]) => ({ method, count }));

  return {
    daily,
    yearly,
    byYear,
    byMonthByYear,
    byMonthAllYears,
    statusCounts: statusArr,
    paymentMethodCounts: paymentArr,
  };
}

// Convert month number → short month name
function monthName(m) {
  return [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ][m - 1] || "";
}

// Find the object with maximum value of a given key
function maxItem(arr = [], key = "count") {
  if (!arr || arr.length === 0) return null;
  return arr.reduce((a, b) => (b[key] > a[key] ? b : a), arr[0]);
}

// Build top cities list from listings
function topCitiesFromListings(listings = []) {
  const map = new Map();
  listings.forEach((l) => {
    const key = `${l?.location?.city || "Unknown"}|${l?.location?.state || ""}`;
    map.set(key, (map.get(key) || 0) + 1);
  });
  return Array.from(map.entries())
    .map(([k, count]) => {
      const [city, state] = k.split("|");
      return { city, state, count };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 7);
} 

/* --------------------------- IconButton Helper --------------------------- */

function IconButton({ 
  icon: Icon, 
  onClick, 
  title = "", 
  danger = false, 
  disabled = false 
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      disabled={disabled}
      className={`inline-flex items-center justify-center w-9 h-9 rounded-lg border text-gray-600 hover:bg-gray-100 transition-colors
        ${danger ? "border-rose-200 hover:bg-rose-50 text-rose-600" : "border-gray-200"}
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
      `}
    >
      {Icon && <Icon className="w-4 h-4" />}
    </button>
  );
}



/* --------------------------- Keep existing utility functions --------------------------- */

// Keep all your existing utility functions like:
// buildAnalytics, maxItem, monthName, topCitiesFromListings, etc.

/* --------------------------- Enhanced Icons --------------------------- */

function SearchIcon(props) { return <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg> }
function UsersIcon() { return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" /></svg> }
function CalendarIcon() { return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> }
function ExclamationIcon(props) { return <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg> }
function LogoutIcon(props){return(<svg {...props} viewBox="0 0 24 24" fill="currentColor"><path d="M16 13v-2H7V8l-5 4 5 4v-3h9z"/><path d="M20 3H10c-1.1 0-2 .9-2 2v4h2V5h10v14H10v-4H8v4c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/></svg>)}
function UserIcon(){return(<svg className="w-5 h-5 text-rose-500" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm0 2c-3.31 0-10 1.66-10 5v3h20v-3c0-3.34-6.69-5-10-5z"/></svg>)}
function HomeIcon(){return(<svg className="w-5 h-5 text-rose-500" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3l9 8h-3v9h-12v-9h-3l9-8z"/></svg>)}
function BuildingIcon(){return(<svg className="w-5 h-5 text-rose-500" viewBox="0 0 24 24" fill="currentColor"><path d="M3 22h18v-2H3v2zM19 2H5c-1.1 0-2 .9-2 2v14h18V4c0-1.1-.9-2-2-2zm-9 14H6v-2h4v2zm0-4H6V8h4v4zm8 4h-6v-2h6v2zm0-4h-6V8h6v4z"/></svg>)}
function CurrencyIcon(){return(<svg className="w-5 h-5 text-emerald-500" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3C7.03 3 3 7.03 3 12s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm1 15h-2v-2H9v-2h2V9h2v2h2v2h-2v2z"/></svg>)}
function EyeIcon(props){return(<svg className={props.className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>)}
function TrashIcon(props){return(<svg className={props.className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>)}