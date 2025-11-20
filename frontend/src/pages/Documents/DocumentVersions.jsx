export function DocumentVersions() {
  const dummy = [
    { version: "v3.0", date: "XX.XX.202X", user: "Max Müller" },
    { version: "v2.1", date: "XX.XX.202X", user: "Max Müller" },
    { version: "v2.0", date: "XX.XX.202X", user: "Max Müller" },
  ];

  return (
    <div className="h-full flex flex-col">
      <h3 className="text-lg font-semibold mb-3">Versions</h3>
      <div className="glass overflow-hidden flex-1">
        <table className="w-full text-sm">
          <thead className="bg-white/5">
            <tr>
              <th className="py-2 px-3 text-left">Version</th>
              <th className="py-2 px-3 text-left">Datum</th>
              <th className="py-2 px-3 text-left">User</th>
              <th className="py-2 px-3 text-right">Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {dummy.map((row, idx) => (
              <tr key={idx} className="border-t border-white/5">
                <td className="py-2 px-3">{row.version}</td>
                <td className="py-2 px-3">{row.date}</td>
                <td className="py-2 px-3">{row.user}</td>
                <td className="py-2 px-3 text-right">
                  <button className="glass-btn text-xs">Download</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
