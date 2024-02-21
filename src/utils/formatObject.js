export const objectToFormData=(object)=>{
    const formData = new FormData();
    const keyList = Object.keys(object);
    keyList.forEach((key)=>{
        if((object[key]!==null&&object[key]!==undefined))formData.append(key,object[key]);
    })
    return formData;
}