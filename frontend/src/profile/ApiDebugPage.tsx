import React, { useState, useEffect } from "react";
import { friendshipAPI } from "../../services/friendshipAPI";
import type { UserFriendDTO } from "../../services/friendshipAPI";

const ApiDebugPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [allUsers, setAllUsers] = useState<UserFriendDTO[]>([]);
  const [searchResults, setSearchResults] = useState<UserFriendDTO[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Test getAllUsers
  const testGetAllUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("🔍 Calling friendshipAPI.getAllUsers(0, 50)...");
      const response = await friendshipAPI.getAllUsers(0, 50);
      console.log("✅ Response:", response);
      setAllUsers(response);
    } catch (err) {
      console.error("❌ Error:", err);
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  // Test searchByLastName
  const testSearchByLastName = async () => {
    if (!searchTerm.trim()) {
      setError("Vui lòng nhập last name");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      console.log(
        `🔍 Calling friendshipAPI.searchByLastName('${searchTerm}')...`,
      );
      const response = await friendshipAPI.searchByLastName(searchTerm);
      console.log("✅ Response:", response);
      setSearchResults(response);
    } catch (err) {
      console.error("❌ Error:", err);
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  // Test searchByEmail
  const testSearchByEmail = async () => {
    if (!searchTerm.trim()) {
      setError("Vui lòng nhập email");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      console.log(`🔍 Calling friendshipAPI.searchByEmail('${searchTerm}')...`);
      const response = await friendshipAPI.searchByEmail(searchTerm);
      console.log("✅ Response:", response);
      setSearchResults(response);
    } catch (err) {
      console.error("❌ Error:", err);
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Auto-test on mount
    testGetAllUsers();
  }, []);

  return (
    <div
      style={{ padding: "20px", fontFamily: "monospace", maxWidth: "1200px" }}
    >
      <h1>🔧 API Debug Page</h1>

      <div
        style={{
          marginBottom: "30px",
          padding: "15px",
          background: "#f5f5f5",
          borderRadius: "8px",
        }}
      >
        <h2>Test getAllUsers()</h2>
        <button onClick={testGetAllUsers} disabled={loading}>
          {loading ? "⏳ Loading..." : "🔍 Get All Users"}
        </button>
        {error && (
          <div style={{ color: "red", marginTop: "10px" }}>
            ❌ Error: {error}
          </div>
        )}
      </div>

      <div
        style={{
          marginBottom: "30px",
          padding: "15px",
          background: "#f5f5f5",
          borderRadius: "8px",
        }}
      >
        <h2>Test Search APIs</h2>
        <input
          type="text"
          placeholder="Enter search term (lastName or email)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: "8px", width: "300px" }}
        />
        <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
          <button onClick={testSearchByLastName} disabled={loading}>
            {loading ? "⏳ Loading..." : "🔍 Search by LastName"}
          </button>
          <button onClick={testSearchByEmail} disabled={loading}>
            {loading ? "⏳ Loading..." : "🔍 Search by Email"}
          </button>
        </div>
        {error && (
          <div style={{ color: "red", marginTop: "10px" }}>
            ❌ Error: {error}
          </div>
        )}
      </div>

      <div style={{ marginBottom: "30px" }}>
        <h2>All Users ({allUsers.length} total)</h2>
        {allUsers.length === 0 ? (
          <p style={{ color: "red" }}>❌ No users returned from API</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ borderCollapse: "collapse", width: "100%" }}>
              <thead>
                <tr style={{ background: "#333", color: "white" }}>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                    ID
                  </th>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                    First Name
                  </th>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                    Last Name
                  </th>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                    Email
                  </th>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                    Points
                  </th>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                    Streak
                  </th>
                </tr>
              </thead>
              <tbody>
                {allUsers.map((user) => (
                  <tr
                    key={user.id}
                    style={{
                      background: user.id % 2 === 0 ? "#f9f9f9" : "white",
                    }}
                  >
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                      {user.id}
                    </td>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                      {user.firstName}
                    </td>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                      {user.lastName}
                    </td>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                      {user.email}
                    </td>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                      {user.points}
                    </td>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                      {user.streak}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div style={{ marginBottom: "30px" }}>
        <h2>Search Results ({searchResults.length} total)</h2>
        {searchResults.length === 0 ? (
          <p>No results yet. Try searching above.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ borderCollapse: "collapse", width: "100%" }}>
              <thead>
                <tr style={{ background: "#333", color: "white" }}>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                    ID
                  </th>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                    First Name
                  </th>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                    Last Name
                  </th>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                    Email
                  </th>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                    Points
                  </th>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                    Streak
                  </th>
                </tr>
              </thead>
              <tbody>
                {searchResults.map((user) => (
                  <tr
                    key={user.id}
                    style={{
                      background: user.id % 2 === 0 ? "#f9f9f9" : "white",
                    }}
                  >
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                      {user.id}
                    </td>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                      {user.firstName}
                    </td>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                      {user.lastName}
                    </td>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                      {user.email}
                    </td>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                      {user.points}
                    </td>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                      {user.streak}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div
        style={{ padding: "15px", background: "#fff3cd", borderRadius: "8px" }}
      >
        <h3>💡 Debugging Tips:</h3>
        <ul>
          <li>Mở DevTools (F12) → Console tab để xem logs</li>
          <li>Mở Network tab để xem API calls</li>
          <li>Kiểm tra backend logs xem có error gì không</li>
          <li>Kiểm tra database xem có users không: SELECT * FROM users;</li>
        </ul>
      </div>
    </div>
  );
};

export default ApiDebugPage;
