
export const recordPerPage = [10, 20, 30]

export const setSearchQueryParams = (searchParams, onPage=null, perPage=null) => {

    let param = '';

    if(onPage){
        param += `page=${onPage + 1}&`
    }

    if(perPage){
        param += `per-page=${perPage}&`
    }else if(searchParams.get('per-page')){
        param += `per-page=${searchParams.get('per-page')}&`
    }

    if(searchParams.get('order-by')){
        param += `order-by=${searchParams.get('order-by')}&`
    }

    if(searchParams.get('search')){
        param += `search=${searchParams.get('search')}&`
    }

    if(searchParams.get('status')){
        param += `status=${searchParams.get('status')}&`
    }
    if(searchParams.get('incluedPublicUser')){
        param += `incluedPublicUser=${searchParams.get('incluedPublicUser')}&`
    }
    if(searchParams.get('CorporateName')){
        param += `CorporateName=${searchParams.get('CorporateName')}&`
    }
    return param;

}


export const getSearchQueryParams = (searchParams) => {

    let param = '';

    if(searchParams.get('page')){
        param += `page=${searchParams.get('page')}&`
    }

    if(searchParams.get('per-page')){
        param += `per_page=${searchParams.get('per-page')}&`
    }else{
        param += `per_page=10&`
    }

    if(searchParams.get('order-by')){
        param += `order_by=${searchParams.get('order-by')}&`
    }

    if(searchParams.get('search')){
        param += `search=${searchParams.get('search')}&`
    }

    if(searchParams.get('status')){
        param += `status=${searchParams.get('status')}&`
    }
    if(searchParams.get('incluedPublicUser')){
        param += `incluedPublicUser=${searchParams.get('incluedPublicUser')}&`
    }
    if(searchParams.get('CorporateName')){
        param += `CorporateName=${searchParams.get('CorporateName')}&`
    }
    return param;

}