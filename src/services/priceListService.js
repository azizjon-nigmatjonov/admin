import request from "../utils/request"

export const getPriceList = (params) => {
    return request.get(`/get-price-list`, params)
}
