export default function AboutPlace({ hotel }) {
  const defaultData = {
    description:
      "A cozy stay near the railway station, in front of Zilla School. Beach is 800m away and Temple is 1.5 km.",
    guestCapacity: "Guest Capacity: 5 (1 double bed + 1 sofa bed)",
    comfort: "Comfort: AC, ceiling fans, smart TV, washing machine",
    kitchen:
      "Kitchen: Fully equipped with stove, fridge, basic cookware, utensils.",
    note: "Non-Veg including eggs cooking is not allowed.",
  };

  return (
    <div className="py-10 border-b border-gray-300">
      <p className="text-3xl font-semibold py-7">About this place</p>
      <p className="py-2">{hotel?.description || defaultData.description}</p>
      <p>{hotel?.guestCapacity || defaultData.guestCapacity}</p>
      <p>{hotel?.comfort || defaultData.comfort}</p>
      <p>{hotel?.kitchen || defaultData.kitchen}</p>
      <p>{hotel?.location || defaultData.description}</p>

      <p className="text-xl font-semibold pt-3">Other things to note</p>
      <p className="py-2">{hotel?.note || defaultData.note}</p>
    </div>
  );
}
