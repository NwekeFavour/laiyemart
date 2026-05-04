// DebugPage.jsx - add route temporarily
export default function DebugPage() {
  const auth = localStorage.getItem("layemart-auth");
  const session = sessionStorage.getItem("pending-auth-sync");
  
  return (
    <div style={{ padding: 20, fontFamily: "monospace", fontSize: 13, wordBreak: "break-all" }}>
      <h3>LocalStorage auth length: {auth?.length || "EMPTY"}</h3>
      <h3>SessionStorage pending: {session?.length || "EMPTY"}</h3>
      <h3>Current URL length: {window.location.href.length}</h3>
      <h3>User Agent: {navigator.userAgent}</h3>
      <pre style={{ background: "#f1f5f9", padding: 10, fontSize: 11 }}>
        {auth ? JSON.stringify(JSON.parse(auth), null, 2).substring(0, 500) + "..." : "No auth data"}
      </pre>
    </div>
  );
}