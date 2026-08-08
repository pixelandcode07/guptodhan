export function downloadVendorsCSV(rows: any[]) {
  if (rows.length === 0) return false;

  const headers = [
    "SL",
    "Name",
    "Email",
    "Phone",
    "Business Name",
    "Trade License",
    "Verified",
    "Status",
    "Created At",
  ];

  const csvData = rows.map((vendor, index) => {
    // Same date formatting as your DataTable
    const createdAt = vendor.createdAt
      ? new Date(vendor.createdAt).toLocaleDateString()
      : "";

    // Same Verified logic as approved_vendor_columns
    const isActive = vendor.user?.isActive;

    const verified =
      isActive === undefined
        ? "N/A"
        : isActive
          ? "Yes"
          : "No";

    // Same Status display logic as your DataTable
    const status = vendor.status
      ? vendor.status.charAt(0).toUpperCase() +
        vendor.status.slice(1)
      : "";

    return [
      index + 1,
      vendor.user?.name || "",
      vendor.user?.email || "",
      vendor.user?.phoneNumber || "",
      vendor.businessName || "",
      vendor.tradeLicenseNumber || "",
      verified,
      status,
      createdAt,
    ];
  });

  const csvContent = [headers, ...csvData]
    .map((row) =>
      row
        .map(
          (field) =>
            `"${String(field ?? "").replace(/"/g, '""')}"`
        )
        .join(",")
    )
    .join("\n");

  // BOM for proper Bangla/Unicode support in Excel
  const BOM = "\uFEFF";

  const blob = new Blob(
    [BOM + csvContent],
    {
      type: "text/csv;charset=utf-8;",
    }
  );

  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);

  link.setAttribute(
    "download",
    `approved_vendors_${new Date()
      .toISOString()
      .split("T")[0]}.csv`
  );

  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);

  return true;
}