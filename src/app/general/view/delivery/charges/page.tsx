import DeliveryChargesClient from "./components/DeliveryChargesClient"

export default function DeliveryChargesPage() {
  return (
    <div className="mx-3 my-4 md:mx-6 md:my-8 space-y-4 md:space-y-6">
      <section className="rounded-lg border border-[#e4e7eb] bg-white/60 backdrop-blur-sm shadow-sm">
        <header className="flex items-center justify-between px-3 py-2 md:px-4 md:py-3 border-b border-[#e4e7eb]">
          <h1 className="text-sm md:text-base font-semibold text-gray-900">Delivery Charge List</h1>
        </header>
        <div className="p-3 md:p-4">
          <DeliveryChargesClient />
        </div>
      </section>
    </div>
  );
}
