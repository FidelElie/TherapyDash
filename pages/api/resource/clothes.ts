import type { NextApiRequest, NextApiResponse } from 'next'

const getClothesData = async (_: NextApiRequest, res: NextApiResponse) => {
    const clothesURL = process.env.CLOTHES_API_URL || ""

    const clothesData = await fetch(clothesURL);
    const clothesResponse = await clothesData.json();

    res.status(200).json(clothesResponse);
}

export default getClothesData;
