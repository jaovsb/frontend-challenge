import {api} from '@/api/client';
import type { Nft } from '@/contracts/nft.ts';  

export async function getNfts(): Promise<Nft[]> {
    const response = await api.get<Nft[]>("/nfts");
    return response.data;
}
