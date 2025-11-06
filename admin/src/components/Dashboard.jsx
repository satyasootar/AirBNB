import React, { useContext, useMemo, useState, useRef, useCallback, useEffect } from "react";
import { StoreContext } from "../context/StoreContext";

export default function Dashboard() {
  const {
    users = [],
    logout,
    setUsers,
    userLoading,
    deleteUser,
    listings = [],
    setListings,
    deleteListing,
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

  // Details
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedListing, setSelectedListing] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);

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
    } catch {
      return dateString;
    }
  };
  const getRoleDisplay = (role) => (role === "HO" ? "Host" : role === "GU" ? "Guest" : "User");
  const formatPrice = (price) => new Intl.NumberFormat("en-IN").format(Number(price || 0));

  const roleStats = useMemo(
    () => ({
      hosts: users.filter((u) => u.role === "HO").length,
      guests: users.filter((u) => u.role === "GU").length,
    }),
    [users]
  );

  const totalRevenueFromBookings = useMemo(
    () => bookings.reduce((s, b) => s + Number(b?.payment?.amount || b?.total_price || 0), 0),
    [bookings]
  );

  const stats = useMemo(
    () => ({
      users: users.length,
      listings: listings.length,
      bookings: bookings.length,
      hosts: roleStats.hosts,
      guests: roleStats.guests,
      totalRevenue: totalRevenueFromBookings,
    }),
    [users.length, listings.length, bookings.length, roleStats.hosts, roleStats.guests, totalRevenueFromBookings]
  );

  // Search filters (simple & global)
  const filteredUsers = useMemo(
    () =>
      users.filter((user) => {
        const s = search.toLowerCase();
        const searchString = (user.username + (user.email || "") + getRoleDisplay(user.role)).toLowerCase();
        return searchString.includes(s);
      }),
    [users, search]
  );

  const filteredListings = useMemo(
    () =>
      listings.filter((l) => {
        const s = search.toLowerCase();
        const searchString = (
          (l.title || "") +
          (l.host?.username || "") +
          (l.location?.city || "") +
          (l.location?.state || "")
        ).toLowerCase();
        return searchString.includes(s);
      }),
    [listings, search]
  );

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
  const showToast = useCallback((text) => {
    setMessage(text);
    setTimeout(() => setMessage(null), 3000);
  }, []);

  const handleDeleteUser = async (id) => {
    const originalUsers = [...users];
    setUsers((prev) => prev.filter((u) => u.id !== id));
    try {
      await deleteUser(id);
      showToast("User deleted successfully");
    } catch {
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
    } catch {
      setListings(originalListings);
      showToast("Failed to delete listing");
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (type, id) => setConfirm({ open: true, type, id });
  const cancelConfirm = () => setConfirm({ open: false, type: null, id: null });
  const runConfirm = () => {
    if (confirm.type === "user") handleDeleteUser(confirm.id);
    if (confirm.type === "listing") handleDeleteListing(confirm.id);
    cancelConfirm();
  };

  /* --------------------------- Infinite scroll --------------------------- */
  const handleUsersScroll = useCallback(
    (e) => {
      const { scrollTop, scrollHeight, clientHeight } = e.target;
      if (scrollHeight - scrollTop <= clientHeight * 1.2 && hasMoreUsers && !isLoadingMoreUsers && !userLoading) {
        fetchMoreUsers();
      }
    },
    [hasMoreUsers, isLoadingMoreUsers, userLoading, fetchMoreUsers]
  );

  const handleListingsScroll = useCallback(
    (e) => {
      const { scrollTop, scrollHeight, clientHeight } = e.target;
      if (scrollHeight - scrollTop <= clientHeight * 1.2 && hasMoreListings && !isLoadingMoreListings && !loading) {
        fetchMoreListings();
      }
    },
    [hasMoreListings, isLoadingMoreListings, loading, fetchMoreListings]
  );

  /* ------------------------------ Analytics ------------------------------ */
  const derived = useMemo(() => buildAnalytics(bookings), [bookings]);
  const dailySeries = derived.daily;
  const monthlySeries = derived.byMonthAllYears;
  const yearlySeries = derived.yearly;

  const peakDaily = maxItem(dailySeries, "count");
  const peakMonthly = maxItem(monthlySeries, "count");
  const peakYearly = maxItem(yearlySeries, "count");

  // Ctrl+K focus search
  useEffect(() => {
    const handleKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <style>{`
        @keyframes slide-in {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes scale-in {
          from { transform: scale(0.96); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-slide-in { animation: slide-in 0.3s ease-out; }
        .animate-scale-in { animation: scale-in 0.18s ease-out; }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold">A</div>
          <div className="mr-auto">
            <h1 className="text-lg font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-xs text-gray-500">Simple • Fast • Clear</p>
          </div>

          {/* Search */}
          <div className="relative w-full max-w-xl">
            <input
              ref={searchInputRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users, listings, bookings… (Ctrl+K)"
              className="w-full bg-gray-100 border-0 rounded-xl px-10 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <SearchIcon className="w-5 h-5" />
            </div>
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>

          <button
            onClick={() => logout?.()}
            className="px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-sm text-gray-700 flex items-center gap-2"
          >
            <LogoutIcon className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Toast */}
        {message && (
          <div className="fixed top-20 right-6 z-50 p-4 rounded-xl bg-emerald-500 text-white shadow-lg min-w-64 animate-slide-in flex items-center justify-between gap-4">
            <span className="font-medium">{message}</span>
            <button onClick={() => setMessage(null)} className="text-white/80 hover:text-white">✕</button>
          </div>
        )}

        {/* If searching, show a tiny summary */}
        {search && (
          <div className="p-3 bg-white border rounded-xl text-sm flex items-center justify-between">
            <div className="text-gray-700">
              Found <b>{filteredUsers.length}</b> users, <b>{filteredListings.length}</b> listings, <b>{filteredBookings.length}</b> bookings for “{search}”
            </div>
            <button onClick={() => setSearch("")} className="text-gray-500 hover:text-gray-700">Clear</button>
          </div>
        )}

        {/* Stats */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Users" value={stats.users} subtitle={`${stats.hosts} hosts • ${stats.guests} guests`} icon={<UsersIcon />} />
          <StatCard title="Listings" value={stats.listings} subtitle="Active properties" icon={<HomeIcon />} />
          <StatCard title="Bookings" value={stats.bookings} subtitle="All time" icon={<CalendarIcon />} />
          <StatCard title="Revenue" value={`₹${formatPrice(stats.totalRevenue)}`} subtitle="Payments received" icon={<CurrencyIcon />} accent />
        </section>

        {/* Analytics — all visible, simple and stacked */}
        <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <Card className="xl:col-span-2">
            <h3 className="text-base font-semibold text-gray-900">Daily Bookings</h3>
            <p className="text-xs text-gray-500 mb-4">Last {Math.min(30, dailySeries.length)} days</p>
            <SimpleLineChart data={dailySeries.slice(-30)} xKey="date" yKey="count" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
              <KPI title="Peak Day" value={peakDaily ? `${peakDaily.date} (${peakDaily.count})` : "—"} />
              <KPI title="Peak Month" value={peakMonthly ? `${peakMonthly.label} (${peakMonthly.count})` : "—"} />
              <KPI title="Peak Year" value={peakYearly ? `${peakYearly.year} (${peakYearly.count})` : "—"} />
            </div>
          </Card>

          <Card>
            <h3 className="text-base font-semibold text-gray-900">Booking Status</h3>
            <SimpleDonut data={derived.statusCounts} labelKey="status" valueKey="count" />
          </Card>

          <Card className="xl:col-span-2">
            <h3 className="text-base font-semibold text-gray-900">Monthly Bookings</h3>
            <p className="text-xs text-gray-500 mb-4">All years combined</p>
            <SimpleBarChart data={monthlySeries} xKey="label" yKey="count" maxBars={12} />
          </Card>

          <Card>
            <h3 className="text-base font-semibold text-gray-900">Payment Methods</h3>
            <SimpleDonut data={derived.paymentMethodCounts} labelKey="method" valueKey="count" />
          </Card>

          <Card className="xl:col-span-2">
            <h3 className="text-base font-semibold text-gray-900">Yearly Bookings</h3>
            <SimpleBarChart data={yearlySeries} xKey="year" yKey="count" />
          </Card>

          <Card>
            <h3 className="text-base font-semibold text-gray-900">Top Cities by Listings</h3>
            <TopCitiesBars data={topCitiesFromListings(listings)} />
          </Card>
        </section>

        {/* Users */}
        <Section title="Users" count={filteredUsers.length} noun="users">
          <div ref={usersContainerRef} onScroll={handleUsersScroll} className="max-h-[520px] overflow-y-auto">
            <table className="w-full table-fixed">
              <Thead columns={["User", "Role", "Joined", "Actions"]} />
              <tbody className="divide-y divide-gray-200">
                {userLoading && users.length === 0 ? (
                  <SkeletonRows count={8} columns={4} />
                ) : filteredUsers.length === 0 ? (
                  <EmptyRow colSpan={4} icon="👤" title="No users found" subtitle={search ? "Adjust your search" : null} />
                ) : (
                  <>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <Avatar src={user.profile_pic} initial={user.username?.[0]} />
                            <div className="min-w-0">
                              <div className="font-medium text-gray-900 truncate">{user.username}</div>
                              <div className="text-xs text-gray-500 truncate">{user.email || "No email"}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4"><RoleBadge role={user.role} /></td>
                        <td className="py-3 px-4"><div className="text-sm text-gray-600">{formatDate(user.date_joined)}</div></td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <IconButton title="View details" onClick={() => setSelectedUser(user)} icon={EyeIcon} />
                            <IconButton title="Delete user" onClick={() => confirmDelete("user", user.id)} icon={TrashIcon} danger />
                          </div>
                        </td>
                      </tr>
                    ))}
                    {isLoadingMoreUsers && <LoadingRow colSpan={4} text="Loading more users..." />}
                    {!hasMoreUsers && filteredUsers.length > 0 && <EndRow colSpan={4} text="No more users" />}
                  </>
                )}
              </tbody>
            </table>
          </div>
        </Section>

        {/* Listings */}
        <Section title="Listings" count={filteredListings.length} noun="listings">
          <div ref={listingsContainerRef} onScroll={handleListingsScroll} className="max-h-[520px] overflow-y-auto">
            <table className="w-full table-fixed">
              <Thead columns={["Property", "Location", "Price/Night", "Actions"]} />
              <tbody className="divide-y divide-gray-200">
                {userLoading && listings.length === 0 ? (
                  <SkeletonRows count={8} columns={4} />
                ) : filteredListings.length === 0 ? (
                  <EmptyRow colSpan={4} icon="🏠" title="No listings found" subtitle={search ? "Adjust your search" : null} />
                ) : (
                  <>
                    {filteredListings.map((l) => (
                      <tr key={l.id} className="hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <ImageThumb src={l.images?.[0]?.url} alt={l.title} />
                            <div className="min-w-0">
                              <div className="font-medium text-gray-900 truncate">{l.title}</div>
                              <div className="text-xs text-gray-500 truncate">{l.host?.username || "Unknown host"}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sm text-gray-900 truncate">{l.location?.city || "Unknown"}</div>
                          <div className="text-xs text-gray-500 truncate">{l.location?.state || ""}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-gray-900">₹{formatPrice(l.price_per_night)}</div>
                          <div className="text-xs text-gray-500">per night</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <IconButton title="View details" onClick={() => setSelectedListing(l)} icon={EyeIcon} />
                            <IconButton title="Delete listing" onClick={() => confirmDelete("listing", l.id)} icon={TrashIcon} danger />
                          </div>
                        </td>
                      </tr>
                    ))}
                    {isLoadingMoreListings && <LoadingRow colSpan={4} text="Loading more listings..." />}
                    {!hasMoreListings && filteredListings.length > 0 && <EndRow colSpan={4} text="No more listings" />}
                  </>
                )}
              </tbody>
            </table>
          </div>
        </Section>

        {/* Bookings */}
        <Section title="Bookings" count={filteredBookings.length} noun="bookings">
          <div ref={bookingsContainerRef} className="max-h-[520px] overflow-y-auto">
            <table className="w-full table-fixed">
              <Thead columns={["Booking", "Guest", "Hotel", "Dates", "Nights", "Amount", "Status", "Actions"]} />
              <tbody className="divide-y divide-gray-200">
                {bookings.length === 0 ? (
                  <SkeletonRows count={8} columns={8} />
                ) : filteredBookings.length === 0 ? (
                  <EmptyRow colSpan={8} icon="📋" title="No bookings found" subtitle={search ? "Adjust your search" : null} />
                ) : (
                  filteredBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm font-medium">#{b.id}</td>
                      <td className="py-3 px-4">
                        <div className="min-w-0">
                          <div className="font-medium text-gray-900 truncate">{b.user?.username}</div>
                          <div className="text-xs text-gray-500 truncate">{b.user?.email}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="min-w-0">
                          <div className="font-medium text-gray-900 truncate">{b.listing_info?.title}</div>
                          <div className="text-xs text-gray-500 truncate">{b.listing_info?.address}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm whitespace-nowrap">
                        {formatDate(b.check_in)} → {formatDate(b.check_out)}
                      </td>
                      <td className="py-3 px-4 text-sm">{b.nights}</td>
                      <td className="py-3 px-4 text-sm font-semibold">₹{formatPrice(b?.payment?.amount || b?.total_price || 0)}</td>
                      <td className="py-3 px-4"><StatusBadge status={b.status} /></td>
                      <td className="py-3 px-4">
                        <IconButton title="View booking" onClick={() => setSelectedBooking(b)} icon={EyeIcon} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Section>
      </main>

      {/* Modal */}
      {confirm.open && (
        <ModernModal onClose={cancelConfirm}>
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <ExclamationIcon className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Confirm Deletion</h3>
            <p className="text-gray-600 mb-6">Delete this {confirm.type}? This action cannot be undone.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={cancelConfirm} className="px-6 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={runConfirm} className="px-6 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700">Delete {confirm.type}</button>
            </div>
          </div>
        </ModernModal>
      )}

      {/* Drawers */}
      {selectedUser && <UserDrawer user={selectedUser} onClose={() => setSelectedUser(null)} />}
      {selectedListing && <ListingDrawer listing={selectedListing} onClose={() => setSelectedListing(null)} />}
      {selectedBooking && <BookingDrawer booking={selectedBooking} onClose={() => setSelectedBooking(null)} />}
    </div>
  );
}

/* ------------------------------ Small UI ------------------------------ */
function Card({ children, className = "" }) {
  return <div className={`bg-white rounded-xl shadow-sm border p-5 ${className}`}>{children}</div>;
}
function KPI({ title, value }) {
  return (
    <div className="rounded-xl border bg-white p-3">
      <div className="text-xs text-gray-500">{title}</div>
      <div className="text-lg font-semibold text-gray-900 mt-0.5">{value}</div>
    </div>
  );
}
function Section({ title, count, noun, children }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      <div className="p-4 border-b flex items-center justify-between bg-white">
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
        <div className="text-sm text-gray-700 bg-gray-50 px-3 py-1 rounded-full border">{count} {noun}</div>
      </div>
      <div className="p-0">{children}</div>
    </div>
  );
}
function Thead({ columns }) {
  return (
    <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
      <tr>
        {columns.map((c) => (
          <th key={c} className="text-left py-3 px-4 text-xs font-medium text-gray-600 uppercase tracking-wider">{c}</th>
        ))}
      </tr>
    </thead>
  );
}
function SkeletonRows({ count = 8, columns = 4 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, rowIndex) => (
        <tr key={rowIndex} className="animate-pulse">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <td key={colIndex} className="py-3 px-4">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}
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
      <td colSpan={colSpan} className="py-4">
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-400"></div>
          <span className="ml-2 text-sm text-gray-500">{text}</span>
        </div>
      </td>
    </tr>
  );
}
function EndRow({ colSpan = 1, text = "No more items" }) {
  return (
    <tr>
      <td colSpan={colSpan} className="py-4 text-center text-gray-500 text-sm">{text}</td>
    </tr>
  );
}
function StatusBadge({ status = "" }) {
  const normalized = String(status || "").toLowerCase();
  const styles = normalized === "confirmed" ? "bg-emerald-100 text-emerald-700 border-emerald-200"
    : normalized === "completed" ? "bg-blue-100 text-blue-700 border-blue-200"
    : normalized === "pending" ? "bg-amber-100 text-amber-700 border-amber-200"
    : normalized === "cancelled" ? "bg-rose-100 text-rose-700 border-rose-200"
    : "bg-gray-100 text-gray-700 border-gray-200";
  const dot =
    styles.includes("emerald") ? "bg-emerald-500" :
    styles.includes("blue") ? "bg-blue-500" :
    styles.includes("amber") ? "bg-amber-500" :
    styles.includes("rose") ? "bg-rose-500" : "bg-gray-400";
  const label = status ? status[0].toUpperCase() + status.slice(1) : "Unknown";
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${styles}`}>
      <span className={`w-2 h-2 rounded-full ${dot}`} />
      {label}
    </span>
  );
}
function Avatar({ src, alt = "User", initial = "?", size = "md" }) {
  const sizeClasses = { sm: "w-8 h-8", md: "w-10 h-10", lg: "w-14 h-14" }[size] || "w-10 h-10";
  return (
    <div className={`rounded-full overflow-hidden bg-gray-200 flex items-center justify-center font-semibold text-gray-700 ${sizeClasses}`}>
      {src ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          onError={(e) => { e.currentTarget.style.display = "none"; }}
        />
      ) : (
        <span>{initial?.toUpperCase() || "?"}</span>
      )}
    </div>
  );
}
function ImageThumb({ src, alt = "Image", fallbackIcon = "🏠", size = "md" }) {
  const sizeClasses = { sm: "w-8 h-8", md: "w-10 h-10", lg: "w-14 h-14" }[size] || "w-10 h-10";
  return (
    <div className={`rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center ${sizeClasses}`}>
      {src ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          onError={(e) => { e.currentTarget.style.display = "none"; }}
        />
      ) : (
        <span className="select-none">{fallbackIcon}</span>
      )}
    </div>
  );
}
function RoleBadge({ role = "" }) {
  const normalized = String(role || "").toUpperCase();
  const style = normalized === "HO" ? "bg-indigo-100 text-indigo-700 border-indigo-200"
    : normalized === "GU" ? "bg-pink-100 text-pink-700 border-pink-200"
    : "bg-gray-100 text-gray-700 border-gray-200";
  const dot = style.includes("indigo") ? "bg-indigo-500" : style.includes("pink") ? "bg-pink-500" : "bg-gray-400";
  const label = normalized === "HO" ? "Host" : normalized === "GU" ? "Guest" : "User";
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${style}`}>
      <span className={`w-2 h-2 rounded-full ${dot}`} />
      {label}
    </span>
  );
}
function IconButton({ icon: Icon, onClick, title = "", danger = false, disabled = false }) {
  return (
    <button
      onClick={onClick}
      title={title}
      disabled={disabled}
      className={`inline-flex items-center justify-center w-9 h-9 rounded-lg border text-gray-600 transition-colors
        ${danger ? "border-rose-200 hover:bg-rose-50 text-rose-600" : "border-gray-200 hover:bg-gray-100"}
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {Icon && <Icon className="w-4 h-4" />}
    </button>
  );
}

/* ------------------------------ Drawers & Modal ------------------------------ */
function ModernModal({ children, onClose }) {
  useEffect(() => {
    const onEsc = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 mx-4 max-w-md w-full shadow-2xl animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600">✕</button>
        {children}
      </div>
    </div>
  );
}
function Drawer({ children, onClose, title, subtitle }) {
  useEffect(() => {
    const onEsc = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/30" onClick={onClose}></div>
      <div className="absolute top-0 right-0 h-full w-full sm:w-[480px] bg-white shadow-2xl rounded-l-2xl overflow-y-auto">
        <div className="p-5 border-b bg-white sticky top-0">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[17px] font-semibold text-gray-900">{title}</div>
              {subtitle && <div className="text-xs text-gray-500 mt-0.5">{subtitle}</div>}
            </div>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100">✕</button>
          </div>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
function InfoField({ label, value, fullWidth = false }) {
  return (
    <div className={fullWidth ? "col-span-2" : ""}>
      <div className="text-xs font-medium text-gray-500 mb-1">{label}</div>
      <div className="text-gray-900 text-sm">{value || "Not provided"}</div>
    </div>
  );
}
function UserDrawer({ user, onClose }) {
  return (
    <Drawer onClose={onClose} title="User Details" subtitle={user.username}>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Avatar src={user.profile_pic} initial={user.username?.[0]} size="lg" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{user.username}</h3>
            <RoleBadge role={user.role} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <InfoField label="Email" value={user.email} />
          <InfoField label="Phone" value={user.phone} />
          <InfoField label="Joined" value={user.date_joined && new Date(user.date_joined).toLocaleString()} />
          <InfoField label="Last Login" value={user.last_login && new Date(user.last_login).toLocaleString()} />
        </div>
        {user.bio && <InfoField label="Bio" value={user.bio} fullWidth />}
      </div>
    </Drawer>
  );
}
function ListingDrawer({ listing, onClose }) {
  const images = listing?.images || [];
  return (
    <Drawer onClose={onClose} title="Listing Details" subtitle={listing.title}>
      <div className="space-y-6">
        <div className="aspect-video rounded-xl bg-gray-200 overflow-hidden">
          {images[0]?.url ? (
            <img src={images[0].url} alt={listing.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400"><HomeIcon className="w-12 h-12" /></div>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <InfoField label="Price / Night" value={`₹${formatPrice(listing?.price_per_night)}`} />
          <InfoField label="Host" value={listing?.host?.username} />
          <InfoField label="City" value={listing?.location?.city} />
          <InfoField label="State" value={listing?.location?.state} />
        </div>
        <InfoField label="Address" value={listing?.location?.address || listing?.address} fullWidth />
        <InfoField label="Description" value={listing?.description} fullWidth />
      </div>
    </Drawer>
  );
}
function BookingDrawer({ booking, onClose }) {
  return (
    <Drawer onClose={onClose} title="Booking Details" subtitle={`#${booking?.id}`}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <StatusBadge status={booking?.status} />
          <div className="text-lg font-semibold text-gray-900">₹{formatPrice(booking?.payment?.amount || booking?.total_price || 0)}</div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <InfoField label="Check-in" value={booking?.check_in && new Date(booking.check_in).toLocaleDateString()} />
          <InfoField label="Check-out" value={booking?.check_out && new Date(booking.check_out).toLocaleDateString()} />
          <InfoField label="Nights" value={booking?.nights} />
          <InfoField label="Guests" value={`Adults ${booking?.adult || 0}, Children ${booking?.children || 0}`} />
        </div>
        <InfoField label="Guest" value={`${booking?.user?.username || "-"} (${booking?.user?.email || "-"})`} fullWidth />
        <InfoField label="Listing" value={`${booking?.listing_info?.title || "-"} — ${booking?.listing_info?.address || "-"}`} fullWidth />
        {booking?.payment && (
          <div className="grid grid-cols-2 gap-4">
            <InfoField label="Method" value={booking.payment.payment_method} />
            <InfoField label="Payment Status" value={booking.payment.status} />
          </div>
        )}
      </div>
    </Drawer>
  );
}

/* ------------------------------ Charts (robust, simple) ------------------------------ */
// Line chart: safe for sparse data, no external libs
function SimpleLineChart({ data = [], xKey, yKey, height = 220 }) {
  if (!Array.isArray(data) || data.length === 0) return <EmptyChart />;
  const w = 680, h = height, pad = 28;
  const ys = data.map((d) => Number(d?.[yKey] || 0));
  const yMax = Math.max(1, ...ys);
  const stepX = (w - pad * 2) / Math.max(1, data.length - 1);
  const x = (i) => pad + i * stepX;
  const y = (v) => h - pad - (v / yMax) * (h - pad * 2);
  const path = data.map((d, i) => `${i ? "L" : "M"}${x(i)},${y(Number(d[yKey] || 0))}`).join(" ");

  return (
    <div className="w-full overflow-x-auto">
      <svg width={w} height={h} className="min-w-[560px]">
        <defs>
          <linearGradient id="lg1" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={path} fill="none" stroke="#3b82f6" strokeWidth="2.5" />
        <path d={`${path} L ${x(data.length - 1)},${h - pad} L ${x(0)},${h - pad} Z`} fill="url(#lg1)" opacity="0.6" />
        {data.map((d, i) => (
          <circle key={i} cx={x(i)} cy={y(Number(d[yKey] || 0))} r="2.5" fill="#3b82f6" />
        ))}
        <AxisBottomSimple w={w} h={h} pad={pad} labels={data.map((d) => String(d[xKey] || ""))} />
        <AxisLeftSimple h={h} pad={pad} max={yMax} />
      </svg>
    </div>
  );
}
function SimpleBarChart({ data = [], xKey, yKey, height = 220, maxBars }) {
  if (!Array.isArray(data) || data.length === 0) return <EmptyChart />;
  const arr = maxBars ? data.slice(-maxBars) : data;
  const w = Math.max(680, 40 * arr.length + 64);
  const h = height, pad = 28;
  const yMax = Math.max(1, ...arr.map((d) => Number(d?.[yKey] || 0)));
  const barW = (w - pad * 2) / Math.max(1, arr.length);

  return (
    <div className="w-full overflow-x-auto">
      <svg width={w} height={h} className="min-w-[560px]">
        {arr.map((d, i) => {
          const v = Number(d[yKey] || 0);
          const bh = (v / yMax) * (h - pad * 2);
          const x = pad + i * barW + 6;
          const y = h - pad - bh;
          return <rect key={i} x={x} y={y} width={barW - 12} height={bh} rx="6" className="fill-emerald-500" />;
        })}
        <AxisBottomSimple w={w} h={h} pad={pad} labels={arr.map((d) => String(d[xKey] || ""))} rotate />
        <AxisLeftSimple h={h} pad={pad} max={yMax} />
      </svg>
    </div>
  );
}
function SimpleDonut({ data = [], labelKey, valueKey, size = 180 }) {
  const cleaned = (Array.isArray(data) ? data : []).filter((d) => Number(d?.[valueKey] || 0) > 0);
  const total = cleaned.reduce((s, d) => s + Number(d[valueKey] || 0), 0);
  if (cleaned.length === 0 || total === 0) return <EmptyChart />;

  const r = size / 2, t = 16;
  let start = 0;
  const colors = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#06b6d4", "#84cc16", "#f97316"];

  return (
    <div className="flex items-center gap-4">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {cleaned.map((d, i) => {
          const val = Number(d[valueKey] || 0) / total;
          const end = start + val * 2 * Math.PI;
          const path = donutArc(r, r, r - t, start, end);
          const node = <path key={i} d={path} stroke={colors[i % colors.length]} strokeWidth={t} fill="none" />;
          start = end;
          return node;
        })}
      </svg>
      <div className="space-y-1 w-full">
        {cleaned.map((d, i) => {
          const v = Number(d[valueKey] || 0);
          const pct = ((v / total) * 100).toFixed(1);
          return (
            <div key={i} className="flex items-center gap-2 text-sm">
              <span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ background: colors[i % colors.length] }}></span>
              <span className="text-gray-700 truncate">{String(d[labelKey] || "")}</span>
              <span className="ml-auto font-medium">{v} <span className="text-xs text-gray-500">({pct}%)</span></span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
function AxisBottomSimple({ w, h, pad, labels = [], rotate = false }) {
  const step = Math.max(1, Math.ceil(labels.length / 10));
  return (
    <g>
      {labels.map((l, i) =>
        i % step === 0 ? (
          <text
            key={i}
            x={pad + (i / Math.max(1, labels.length - 1)) * (w - pad * 2)}
            y={h - 8}
            textAnchor="middle"
            className="fill-gray-500 text-[10px]"
            transform={rotate ? `rotate(45 ${pad + (i / Math.max(1, labels.length - 1)) * (w - pad * 2)} ${h - 8})` : undefined}
          >
            {String(l).length > 8 ? String(l).slice(0, 8) + "…" : String(l)}
          </text>
        ) : null
      )}
    </g>
  );
}
function AxisLeftSimple({ h, pad, max }) {
  const ticks = 4;
  return (
    <g>
      {Array.from({ length: ticks + 1 }).map((_, i) => {
        const y = h - pad - (i / ticks) * (h - pad * 2);
        const val = Math.round((i / ticks) * max);
        return (
          <g key={i}>
            <line x1={28} x2={32} y1={y} y2={y} stroke="#e5e7eb" />
            <text x={20} y={y + 4} className="fill-gray-400 text-[10px]" textAnchor="end">{val}</text>
          </g>
        );
      })}
    </g>
  );
}
function donutArc(cx, cy, r, start, end) {
  const x1 = cx + r * Math.cos(start), y1 = cy + r * Math.sin(start);
  const x2 = cx + r * Math.cos(end), y2 = cy + r * Math.sin(end);
  const large = end - start > Math.PI ? 1 : 0;
  return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
}
function TopCitiesBars({ data = [] }) {
  if (!data || data.length === 0) return <EmptyChart />;
  const maxVal = Math.max(1, ...data.map((d) => Number(d.count || 0)));
  return (
    <div className="space-y-3">
      {data.map((d, i) => {
        const width = (Number(d.count || 0) / maxVal) * 100;
        return (
          <div key={i} className="flex items-center gap-3">
            <div className="w-32 text-sm font-medium text-gray-700 truncate">{d.city}</div>
            <div className="flex-1 h-7 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-sky-500 to-sky-600 rounded-full" style={{ width: `${width}%` }} />
            </div>
            <div className="w-10 text-right text-sm font-semibold">{d.count}</div>
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------ Analytics Utils ------------------------------ */
function buildAnalytics(bookings = []) {
  const dailyMap = new Map();
  const monthAgg = new Map();
  const yearMap = new Map();
  const statusCounts = {};
  const paymentMethodCounts = {};

  (bookings || []).forEach((b) => {
    const created = (b?.created_at || "").slice(0, 10); // YYYY-MM-DD
    if (created) {
      dailyMap.set(created, (dailyMap.get(created) || 0) + 1);
      const y = created.slice(0, 4);
      const ym = created.slice(0, 7);
      yearMap.set(y, (yearMap.get(y) || 0) + 1);
      monthAgg.set(ym, (monthAgg.get(ym) || 0) + 1);
    }
    const st = String(b?.status || "Unknown");
    const stLabel = st[0].toUpperCase() + st.slice(1).toLowerCase();
    statusCounts[stLabel] = (statusCounts[stLabel] || 0) + 1;

    let pm = b?.payment?.payment_method || b?.payment_method || "Other";
    pm = formatPaymentMethod(pm);
    paymentMethodCounts[pm] = (paymentMethodCounts[pm] || 0) + 1;
  });

  const daily = Array.from(dailyMap.entries()).sort((a, b) => a[0].localeCompare(b[0])).map(([date, count]) => ({ date, count }));
  const yearly = Array.from(yearMap.entries()).sort((a, b) => a[0].localeCompare(b[0])).map(([year, count]) => ({ year, count }));

  // Monthly labels: "Mon YYYY"
  const byMonthAllYears = Array.from(monthAgg.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([ym, count]) => {
      const [y, m] = ym.split("-");
      return { label: `${monthName(Number(m))} ${y}`, count };
    });

  const statusArr = Object.entries(statusCounts).map(([status, count]) => ({ status, count }));
  const paymentArr = Object.entries(paymentMethodCounts).map(([method, count]) => ({ method, count }));

  return {
    daily,
    yearly,
    byYear: Object.fromEntries(yearly.map((y) => [y.year, y.count])),
    byMonthByYear: {}, // not needed in this simplified view
    byMonthAllYears,
    statusCounts: statusArr,
    paymentMethodCounts: paymentArr,
  };
}
function monthName(m) {
  return ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][m - 1] || "";
}
function maxItem(arr = [], key = "count") {
  if (!arr || arr.length === 0) return null;
  return arr.reduce((a, b) => (Number(b[key] || 0) > Number(a[key] || 0) ? b : a), arr[0]);
}
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
function formatPaymentMethod(method) {
  if (!method) return "Other";
  const m = String(method).toLowerCase();
  const map = {
    card: "Credit Card",
    "credit_card": "Credit Card",
    "debit_card": "Debit Card",
    paypal: "PayPal",
    upi: "UPI",
    netbanking: "Net Banking",
    wallet: "Digital Wallet",
    cash: "Cash",
    other: "Other",
    unknown: "Other",
  };
  return map[m] || (m[0].toUpperCase() + m.slice(1));
}

/* ------------------------------ Icons ------------------------------ */
function SearchIcon(props) { return <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>; }
function UsersIcon() { return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" /></svg>; }
function HomeIcon() { return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>; }
function CalendarIcon() { return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>; }
function CurrencyIcon() { return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" /></svg>; }
function LogoutIcon(props) { return (<svg {...props} viewBox="0 0 24 24" fill="currentColor"><path d="M16 13v-2H7V8l-5 4 5 4v-3h9z"/><path d="M20 3H10c-1.1 0-2 .9-2 2v4h2V5h10v14H10v-4H8v4c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/></svg>); }
function ExclamationIcon(props) { return <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>; }
function EyeIcon(props) { return <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>; }
function TrashIcon(props) { return <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>; }

function StatCard({ title, value, subtitle, icon, accent = false }) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border p-5 ${accent ? "border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50" : ""}`}>
      <div className="flex items-center justify-between mb-3">
        <div className={`p-3 rounded-xl ${accent ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600"}`}>
          {icon}
        </div>
      </div>
      <div className="text-[22px] font-bold text-gray-900 leading-none">{value}</div>
      <div className="text-sm text-gray-600">{title}</div>
      {subtitle ? <div className="text-xs text-gray-500 mt-1">{subtitle}</div> : null}
    </div>
  );
}
function EmptyChart({ message = "No data available" }) {
  return (
    <div className="h-64 flex items-center justify-center">
      <div className="text-center text-gray-500">
        <div className="text-4xl mb-2">📉</div>
        <div className="text-sm">{message}</div>
      </div>
    </div>
  );
}
