import { useEffect, useState } from "react";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [apps, setApps] = useState([]);
  const [form, setForm] = useState({
    company: "",
    position: "",
    date_applied: "",
    status: "Applied",
    notes: "",
  });
  const [editingId, setEditingId] = useState(null);

  // ✅ Fetch user info
  useEffect(() => {
    fetch("http://localhost:5000/auth/user", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch((err) => console.error(err));
  }, []);

  // ✅ Fetch applications
  useEffect(() => {
    fetch("http://localhost:5000/api/applications", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setApps(data))
      .catch((err) => console.error(err));
  }, []);

  // ✅ Handle form input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Add or Update application
  const handleSubmit = (e) => {
    e.preventDefault();

    const method = editingId ? "PUT" : "POST";
    const url = editingId
      ? `http://localhost:5000/api/applications/${editingId}`
      : "http://localhost:5000/api/applications";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then(() => {
        setForm({ company: "", position: "", date_applied: "", status: "Applied", notes: "" });
        setEditingId(null);
        return fetch("http://localhost:5000/api/applications", { credentials: "include" });
      })
      .then((res) => res.json())
      .then((data) => setApps(data));
  };

  // ✅ Edit app
  const handleEdit = (app) => {
    setForm(app);
    setEditingId(app.id);
  };

  // ✅ Delete app
  const handleDelete = (id) => {
    fetch(`http://localhost:5000/api/applications/${id}`, {
      method: "DELETE",
      credentials: "include",
    })
      .then(() =>
        fetch("http://localhost:5000/api/applications", { credentials: "include" })
      )
      .then((res) => res.json())
      .then((data) => setApps(data));
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Welcome, {user.name}</h1>

      {/* ✅ Form */}
      <form onSubmit={handleSubmit} className="space-y-3 mb-6">
        <input
          name="company"
          value={form.company}
          onChange={handleChange}
          placeholder="Company"
          className="border p-2 rounded w-full"
          required
        />
        <input
          name="position"
          value={form.position}
          onChange={handleChange}
          placeholder="Position"
          className="border p-2 rounded w-full"
          required
        />
        <input
          type="date"
          name="date_applied"
          value={form.date_applied}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        >
          <option>Applied</option>
          <option>Interview</option>
          <option>Offer</option>
          <option>Rejected</option>
        </select>
        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          placeholder="Notes"
          className="border p-2 rounded w-full"
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded-lg"
        >
          {editingId ? "Update" : "Add"}
        </button>
      </form>

      {/* ✅ Applications List */}
      <ul className="space-y-3">
        {apps.map((app) => (
          <li key={app.id} className="border p-4 rounded-lg flex justify-between items-center">
            <div>
              <h2 className="font-bold">{app.company} — {app.position}</h2>
              <p>Status: {app.status}</p>
              <p>Date Applied: {app.date_applied}</p>
              {app.notes && <p className="text-sm text-gray-600">Notes: {app.notes}</p>}
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handleEdit(app)}
                className="px-3 py-1 bg-blue-500 text-white rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(app.id)}
                className="px-3 py-1 bg-red-500 text-white rounded"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
