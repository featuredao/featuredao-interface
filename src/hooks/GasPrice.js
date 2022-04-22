// import axios from 'axios';
import { useQuery } from 'react-query';

export function useGasPriceQuery(speed) {
  return useQuery(
    ['gas-price', speed],
    async () => {
      // const response = await axios.get(
      //   'https://ethgasstation.info/json/ethgasAPI.json',
      // );
      // const data = response.data[speed] * 100000000;
      // console.log('data', data);
      // return data;
      return 3000 * 100000000;
    },
    {
      refetchInterval: 30000,
      staleTime: 30000,
    },
  )
}
