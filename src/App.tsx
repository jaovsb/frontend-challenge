import { useNfts } from "@/features/nfts/queries";


function App() {

  const { data, isLoading, isError } = useNfts();
   if (isLoading) {
    return <div>Loading...</div>;
  }
  if  (isError) {
    return <div>Error fetching NFTs</div>;
  }
  const nfts = data ?? [];
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">
        Jungle Marketplace
      </h1> 
      {nfts.length === 0 ? (
        <p>Nenhum NFT encontrado.</p>
      ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
            {nfts.map((nft) => (
              <div key={nft.id} className="bg-gray-800 p-4 rounded-lg">
              {nft.name}
              <p>
                {nft.price} ETH
             </p>
           </div>
          
         ))}
        </div>
      )}
      
    </main>
  )
}

export default App
