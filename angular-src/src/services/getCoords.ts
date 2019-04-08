// import { } from '@types/googlemaps';
/// <reference types="@types/googlemaps" />

export function GetLatlong(address)
{
    return new Promise((resolve, reject) =>{
        var geocoder = new google.maps.Geocoder();

        geocoder.geocode({ 'address': address }, function (results, status) {
    
            if (status == google.maps.GeocoderStatus.OK) {
                var latitude = results[0].geometry.location.lat();
                var longitude = results[0].geometry.location.lng();
                let arr: any = [];
                arr.push(longitude);
                arr.push(latitude);
                resolve(arr);
            }
        });
    })
    
}