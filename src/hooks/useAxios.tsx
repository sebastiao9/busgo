import { useCallback } from "react";
import axios, { AxiosResponse, AxiosRequestConfig } from "axios";
import { atom, useAtom } from "jotai";

let axiosResponse: AxiosResponse;

const dataAtom = atom([]);
const loadingAtom = atom({});
const erroAtom = atom({});

const useAxios = () => {
  const [dataResponse, setDataResponse] = useAtom(dataAtom);
  const [loading, setLoading] = useAtom(loadingAtom);
  const [erro, setErro] = useAtom(erroAtom);

  const fetchData = useCallback(
    async ({ url, method, params, data = null, headers = null }: AxiosRequestConfig) => {
      setDataResponse([]);
      try {
        axiosResponse = await axios({
          url: url,
          method: method,
          params: params,
          data: data,
          headers: headers,
          baseURL: `https://bus-iot.herokuapp.com/`,
          onUploadProgress: () => {
            setLoading(true);
          },
        });
      } catch (error) {
        if (error.response) {
          setDataResponse(undefined);
          setErro(error);
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log("Error", error.message);
        }
      } finally {
        if (axiosResponse && axiosResponse.status === 200) {
          setDataResponse(axiosResponse.data);
          setLoading(false);
        }
      }
    },
    [setDataResponse, setErro, setLoading]
  );

  return {
    axiosRequest: {
      fetchData,
      dataResponse,
      loading,
      erro,
    },
  };
};

export default useAxios;
