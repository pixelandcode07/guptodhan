import BuySellConfigPage from "./components/BuySellConfigPage";


export default function BuySellConfig() {

    return (
        <div className='p-4'>
            <div className='bg-white p-4 border rounded-md'>
                <div >
                    <h1 className="text-lg font-semibold border-l-2 border-blue-500">
                        <span className="pl-5">BuySell Config Form</span>
                    </h1>
                </div>
                <div className='my-10 space-y-8'>
                    {/* BuySellConfigPage */}
                    <BuySellConfigPage />

                </div>
            </div>
        </div>
    )
}
