import Link from "next/link";
import stores from "../../../data/stores.json";

export default function Stores() {
  return (
    <div>
      <h1>Stores</h1>
      <Link href="/">Back to Home</Link>
      <ul>
        {stores.map((store) => (
          <li key={store.id} className="frosted-card mb-2">
            <strong>{store.name}</strong>
            <br />
            {store.address}
            <br />
            Phone: {store.phone}
            <br />
            Hours: {store.hours}
          </li>
        ))}
      </ul>
    </div>
  );
}
