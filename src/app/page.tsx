const categories = [
  "Jobs",
  "Vehicles",
  "Property",
  "Electronics",
  "Services",
  "Fashion",
];

const featuredListings = [
  {
    title: "Cloud Sales Associate, ATLANCIS Technologies",
    location: "Makadara, Nairobi",
    price: "Apply with CV",
    type: "Job",
    status: "New",
  },
  {
    title: "2018 MAZDA CX5 XDL PACKAGE",
    location: "Karen, Nairobi",
    price: "KSh 3,350,000",
    type: "Vehicle",
    status: "Featured",
  },
  {
    title: "4 Bedroom House to Rent in Kangundo Road",
    location: "Kangundo, Machakos",
    price: "KSh 50,000 / month",
    type: "Property",
    status: "New",
  },
];

export default function Home() {
  return (
    <main className="site-wrap">
      <header className="hero">
        <p className="eyebrow">Post Free Adverts in Kenya</p>
        <h1>Kahustle Marketplace</h1>
        <p className="subtext">
          Buy, sell, and discover trusted listings across jobs, property,
          vehicles, and more.
        </p>

        <form className="searchBar" action="#" method="get">
          <input type="text" placeholder="What are you looking for?" />
          <select defaultValue="All Categories" aria-label="Category">
            <option>All Categories</option>
            {categories.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
          <button type="submit">Search</button>
        </form>
      </header>

      <section className="categories" aria-label="Popular categories">
        {categories.map((category) => (
          <article key={category} className="categoryCard">
            <h2>{category}</h2>
            <p>Browse latest {category.toLowerCase()} adverts</p>
          </article>
        ))}
      </section>

      <section className="listings">
        <div className="sectionHead">
          <h2>Featured Listings</h2>
          <a href="#">View all adverts</a>
        </div>

        <div className="listingGrid">
          {featuredListings.map((listing) => (
            <article key={listing.title} className="listingCard">
              <span className="badge">{listing.status}</span>
              <h3>{listing.title}</h3>
              <p className="meta">
                {listing.type} • {listing.location}
              </p>
              <p className="price">{listing.price}</p>
              <button type="button">View Details</button>
            </article>
          ))}
        </div>
      </section>

      <footer className="footer">
        <p>© {new Date().getFullYear()} Kahustle. All rights reserved.</p>
      </footer>
    </main>
  );
}
