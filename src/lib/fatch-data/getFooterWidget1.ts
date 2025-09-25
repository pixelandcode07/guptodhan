export async function getFooterWidgets() {
  const res = await fetch(
    'http://localhost:3000/api/v1/public/footer-widgets',
    {
      cache: 'no-store', // fresh data every request
    }
  );
  if (!res.ok) throw new Error('Failed to fetch widgets');

  const json = await res.json();
  if (json.success && json.data.length > 0) {
    const widget = json.data[0];
    return {
      widgetTitle: widget.widgetTitle,
      rows: widget.links.map(
        (link: { title: string; url: string }, index: number) => ({
          id: index,
          linkLabel: link.title,
          url: link.url,
        })
      ),
    };
  }
  return { widgetTitle: '', rows: [] };
}
