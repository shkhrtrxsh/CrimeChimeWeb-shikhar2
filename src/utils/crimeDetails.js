import { WeaponChoices } from "src/constants/showWeapons";
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { jwtDecode } from "jwt-decode";
import { useSelector } from "react-redux";
const { capitalize } = require("./string");
// const various_choices1 = ["crime occured at ATM" ,"i believe crime to be drug-related","i believe crime to be gang-related" ,"Arson was involed","Does not apply"," Vandalism was involed" ,"social an unrest","Bombs were involved"]


export const CrimeDetails=(values,index,vehicle_theft_choices,various_choices,mediaData)=>{
  //const values2 = useSelector(state=> state.reportRegister.nearbyData);
  console.log(values[index]);
    const {date_time,user,location,latitude,longitude,perpetrators,perpetrators_des,shoplifting,bribery,is_bribery_paid,weapons,fully_auto_weapons,semi_auto_weapons,knife_weapons,other_weapons,rape,rape_people,murders,murders_people,farm_murder,victim_name,assault,assault_people,vehicle_theft,vehicle_colour,vehicle_make,vehicle_model,vehicle_year,burglary,burglary_type,robbery,robbery_type,kidnapping,kidnapping_people,various,police_reporting,reported_to_the_police,police_case_num,description,fully_auto_weapons_count,knife_weapons_count,other_weapons_count,semi_auto_weapons_count,is_drug_related}=values[index] || values[0] || {};
    
    const utcDate = new Date(date_time);
    const localDateString = utcDate.toLocaleString();
    const profile = JSON.parse(localStorage.getItem("profile"))
    const various_choices1 = [`I believe this crime to be drug-related  ${is_drug_related === "3" ? "(Perpetrator(s) buying/selling drugs)" : is_drug_related === "2" ? "(Perpetrator(s) under the influence of drugs/alcohol)" : ""}`,"Crime occurred at ATM","Does not apply","I believe this crime to be gang-related" ,"Arson was involved","Vandalism was involved" ,"Social an unrest","Bombs were involved"]
    const cleanedString1 = various?.replace(/"|\[|\]/g, '');
    const cleanedString2 = cleanedString1?.replace(/,+/g, ',');
    const cleanedArray1 = cleanedString2?.split(',').map(Number);
    const cleanedArray = cleanedArray1?.filter(element => element !== 2);
    const uniqueSet = new Set(cleanedArray);
    const uniqueArray = Array.from(uniqueSet);
    const mappedChoices = uniqueArray.map(index => various_choices1[index]);
    const resultString = mappedChoices.map(choice => `${choice}<br>`).join('');
    return [
        { firstCol: 'Date/Time Occurred:', secondCol:  
          (
            <div>
              <p style={{ position: "absolute" }}>{localDateString}</p>
              {user && user.corporate !== null && user.corporate !== undefined ? (
                <>
                  <img
                    src={user.corporate.logo}
                    style={{ height: "30px", width: "30px", border: "2px solid #333", borderRadius: "50%", float:"right"}}
                    alt="No Data Available"
                  />
                  {user.corporate.is_verify === 1 ? <CheckBoxIcon style={{ height: "30px", width: "30px", color: "#29C250", float:"right" }} /> : ''}
                </>
              ) : ''
              }
            </div>
          ),
        },
        { firstCol: 'Address:', secondCol: (()=>{ return (
          <div>
            <p>{location}</p><br></br>
            <p>{latitude}</p>
            <p>{longitude}</p>
          </div>
        ); 
        })() },
        
        { firstCol: 'Description:', secondCol: (()=>{
          if(profile && profile.data.role_id==="1"){
            return `${jwtDecode(description).description}`
          }
        })() },
        { firstCol: 'Perpetrators:', secondCol: 
        (()=>{
          if(perpetrators&&perpetrators!=null&&perpetrators!=="-1"&&perpetrators!=="0"){
            let pedes = '';
            if(perpetrators_des!==null && profile && profile.data.role_id==="1"){
              pedes = ', '+ jwtDecode(perpetrators_des).perpetrators_des;
            }
            return `(${perpetrators}) ${pedes}`
          }

        })() },

        { firstCol: 'Weapons:', secondCol: (()=>{
          if(weapons && weapons===1 && weapons!=null && (fully_auto_weapons === 1 || semi_auto_weapons ===1 || knife_weapons ===1 || other_weapons ===1 )){
            return (
              <div>
                {fully_auto_weapons === 1 && fully_auto_weapons!=null && fully_auto_weapons_count>0? (
                  <>
                    Fully Automatic:
                    {WeaponChoices[fully_auto_weapons]} ({fully_auto_weapons_count})
                    <br /></>
                ) : null}
                {semi_auto_weapons === 1 && semi_auto_weapons!=null && semi_auto_weapons_count>0? (
                  <>
                    Semi Automatic: 
                    {WeaponChoices[semi_auto_weapons]} ({semi_auto_weapons_count})
                  <br /></>
                ) : null}
                {knife_weapons ===1 && knife_weapons!=null && knife_weapons_count>0? (
                  <>
                    Knife: 
                    {WeaponChoices[knife_weapons]} ({knife_weapons_count})
                  <br /></>
                ) : null}
                {other_weapons ===1 && other_weapons !=null && other_weapons_count>0? (
                  <>
                    Other: 
                    {WeaponChoices[other_weapons]} ({other_weapons_count})
                  <br /></>
                ) : null}
              </div>
            );
          }
        })() },

        { firstCol: 'Rape:', secondCol:(()=>{
          if(rape===0){
            return null
          }
          if(rape===1){
            return `Attempted Rape (${rape_people})`
          }
          if(rape===2){
            return `Rape (${rape_people})`
          }
        })() },
        { firstCol: 'Murder:', secondCol:(()=>{
          if(murders === 1) {
            return (
              <div>
                {`Murder (${murders_people})`}
               <br/>
                {farm_murder === 1 && `It was a farm murder`}<br />
                {victim_name && (
                  <span>{'Name(s) of victim(s) '}<br/>{ victim_name.replace(/"/g, '')}</span>
                )}
              </div>
            );
          }
        } )() },
        { firstCol: 'Assault:', secondCol:(()=>{
          switch(assault){
            case 0:return ``
            case 1:return `Murder(${assault_people})`
            default:return null;//`No`
          }
        })() },
        { firstCol: 'Vehicle related:', secondCol:(()=>{
          if(vehicle_theft==4 || vehicle_theft=="4"){
            return null;
          }else{
            return( <div>
              {capitalize(`${vehicle_theft_choices[vehicle_theft]}`)},<br></br>
              {(vehicle_year||vehicle_colour||vehicle_make||vehicle_model)?capitalize(`${[vehicle_year,vehicle_colour,vehicle_make,vehicle_model].filter((el)=>el).join(" ")} Vehicle`):"Vehicle Description Unavailable"}
            </div>);
          }
        })() },
        { firstCol: 'Vehicle Type:', secondCol:(()=>{
          if(vehicle_theft===4 && vehicle_theft==="4"){
            return null;
          }else{
            return (vehicle_year||vehicle_colour||vehicle_make||vehicle_model)?capitalize(`${[vehicle_year,vehicle_colour,vehicle_make,vehicle_model].filter((el)=>el).join(" ")} Vehicle`):"Vehicle Description Unavailable"
          }
        })() },
        { firstCol: 'Burglary:', secondCol:(()=>{
          if(burglary===0){
            return null;
          }
          if(burglary===1){
            return `Attempted Burglary (${burglary_type}) `;
          }
          if(burglary===2){
            return `Burglary (${burglary_type})`;
          }
        })() },
        { firstCol: 'Robbery:', secondCol:(()=>{
          if(robbery===0){
            return null;
          }
          if(robbery===1){
            return `Attempted Burglary of ${robbery_type} `
          }
          if(robbery===2){
            return `Robbery (${robbery_type})`;
          }
        })() },
        { firstCol: 'Kidnapping:', secondCol:(()=>{
          if(kidnapping===0){
            return null;
          }
          if(kidnapping===1){
            return `Attempted Kidnapping of (${kidnapping_people}) `
          }
          if(kidnapping===2){
            return `Number of person(s) kidnapped (${kidnapping_people})`;
          }
        })() },
        { firstCol: 'Bribery:', secondCol:(()=>{
          if(bribery===0){
            return null;
          }
          if(bribery===1){
            return (
              <div> Bribe request by polic officer
                {is_bribery_paid && is_bribery_paid===1? (
                  <>
                    (Bribery was paid)
                    </>
                ) : null}
                </div>
            )
          }
          if(bribery===2){
            return (
              <div> Bribe request by civil servant
                {is_bribery_paid && is_bribery_paid===1? (
                  <>
                    (Bribery was paid)
                    </>
                ) : null}
                </div>
            )
          }
          if(bribery===3){
            return (
              <div> Bribe request by politician
                {is_bribery_paid && is_bribery_paid===1? (
                  <>
                    (Bribery was paid)
                    </>
                ) : null}
                </div>
            )
          }
        })() },
        { firstCol: 'Shoplifting:', secondCol:(()=>{
          if(shoplifting===0){
            return null;
          }
          if(shoplifting===1){
            return `Attempted Shoplifting`
          }
          if(shoplifting===2){
            return `Shoplifting`;
          }
        })() },
        { firstCol: 'Reason for Crime:', secondCol: 
          (()=>{
            if(cleanedArray && resultString !=null && resultString.length > 0){
              return <div dangerouslySetInnerHTML={{ __html: resultString }} />
            }
          })()
        },
        { firstCol: 'Police Visited Crime Scene:', secondCol: (police_reporting==1?"Yes":"No") },
        { firstCol: 'Formally reported to the police:', secondCol: (reported_to_the_police==1?"Yes":"No") },
        { firstCol: 'Police Case Number:', secondCol: police_case_num?police_case_num:null },
        { firstCol: 'Media:', secondCol: mediaData },
      ];
}