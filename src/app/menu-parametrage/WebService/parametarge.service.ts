import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ParametargeService {

  constructor(private http: HttpClient) { }
  


  GetVueByCode(code:number): Observable<any> {

    return this.http.get(`${environment.API_Parametrage}VpriceList/`+code )
  }

  
  GetVue(): Observable<any> {

    return this.http.get(`${environment.API_Parametrage}VpriceList/all` )
  }


  GetCompteur(code:string): Observable<any> {

    return this.http.get(`${environment.API_Parametrage}compteur/`+code )
  }



  //// Banque
  GetBanque(): Observable<any> {

    return this.http.get(`${environment.API_Parametrage}banque/all` )
  }

  GetBanqueByCode(code:number): Observable<any> {

    return this.http.get(`${environment.API_Parametrage}banque/`+code )
  }

  PostBanque(body: any) {
    return this.http.post(`${environment.API_Parametrage}banque`, body);
  } 
  UpdateBanque(body: any) {
    return this.http.put(`${environment.API_Parametrage}banque/update`, body);
  }

  DeleteBanque(code: any) {
    return this.http.delete(`${environment.API_Parametrage}banque/delete/`+code);
  }


  
  //// Cabinet
  GetCabinet(): Observable<any> {

    return this.http.get(`${environment.API_Parametrage}cabinet/all` )
  }

  GetCabinetByCode(code:number): Observable<any> {

    return this.http.get(`${environment.API_Parametrage}cabinet/`+code )
  }

  PostCabinet(body: any) {
    return this.http.post(`${environment.API_Parametrage}cabinet`, body);
  } 
  UpdateCabinet(body: any) {
    return this.http.put(`${environment.API_Parametrage}cabinet/update`, body);
  }

  DeleteCabinet(code: any) {
    return this.http.delete(`${environment.API_Parametrage}cabinet/delete/`+code);
  }


  
  //// SpecialiteCabinet
  GetSpecialiteCabinet(): Observable<any> {

    return this.http.get(`${environment.API_Parametrage}specialite_cabinet/all` )
  }

  GetSpecialiteCabinetByCode(code:number): Observable<any> {

    return this.http.get(`${environment.API_Parametrage}specialite_cabinet/`+code )
  }

  PostSpecialiteCabinet(body: any) {
    return this.http.post(`${environment.API_Parametrage}specialite_cabinet`, body);
  } 
  UpdateSpecialiteCabinet(body: any) {
    return this.http.put(`${environment.API_Parametrage}specialite_cabinet/update`, body);
  }

  DeleteSpecialiteCabinet(code: any) {
    return this.http.delete(`${environment.API_Parametrage}specialite_cabinet/delete/`+code);
  }


  
  //// SpecialiteMedecin
  GetSpecialiteMedecin(): Observable<any> {

    return this.http.get(`${environment.API_Parametrage}specialite_medecin/all` )
  }

  GetSpecialiteMedecinByCode(code:number): Observable<any> {

    return this.http.get(`${environment.API_Parametrage}specialite_medecin/`+code )
  }

  PostSpecialiteMedecin(body: any) {
    return this.http.post(`${environment.API_Parametrage}specialite_medecin`, body);
  } 
  UpdateSpecialiteMedecin(body: any) {
    return this.http.put(`${environment.API_Parametrage}specialite_medecin/update`, body);
  }

  DeleteSpecialiteMedecin(code: any) {
    return this.http.delete(`${environment.API_Parametrage}specialite_medecin/delete/`+code);
  }


  
   /// TypeCaisse 

  
   GetTypeCaisse(): Observable<any> {

    return this.http.get(`${environment.API_Parametrage}type_caisse/all`);
  }

  PostTypeCaisse(body: any) {

    return this.http.post(`${environment.API_Parametrage}type_caisse`, body);
  } 
  UpdateTypeCaisse(body: any) {

    return this.http.put(`${environment.API_Parametrage}type_caisse/update`, body);
  }

  DeleteTypeCaisse(code: any) {

    return this.http.delete(`${environment.API_Parametrage}type_caisse/delete/`+code);
  }


  
  
//caisse

GetCaisse(): Observable<any> {

  return this.http.get(`${environment.API_Parametrage}caisse/all` )
}

GetCaisseByCodeDevise(codeDevise : number): Observable<any> {

  return this.http.get(`${environment.API_Parametrage}caisse/codeDevise?codeDevise=`+ codeDevise )
}


GetCaisseByCode(code : number) {

  return this.http.get(`${environment.API_Parametrage}caisse/`+code)
}
GetCaisseNotIn(code:number,codeDevise:number): Observable<any> {

  return this.http.get(`${environment.API_Parametrage}caisse/not_in?code=`+code +`&codeDevise=`+codeDevise)  
}
PostCaisse(body: any) : Observable<any> {

  return this.http.post(`${environment.API_Parametrage}caisse`, body);
}

UpdateCaisse(body: any) {

  return this.http.put(`${environment.API_Parametrage}caisse/update`, body);
}

DeleteCaisse(code: any) {

  return this.http.delete(`${environment.API_Parametrage}caisse/delete/`+code);
}




  /// Devise 

  
  GetDevise(): Observable<any> {

    return this.http.get(`${environment.API_Parametrage}devise/all`);
  }
  GetDeviseByHasNotTaux(): Observable<any> {
    return this.http.get(`${environment.API_Parametrage}devise/hasTaux`)
  }

  GetDeviseByCode(code:number) {
    return this.http.get(`${environment.API_Parametrage}devise/`+code)
  }

  PostDevise(body: any) {

    return this.http.post(`${environment.API_Parametrage}devise`, body);
  } 
  UpdateDevise(body: any) {

    return this.http.put(`${environment.API_Parametrage}devise/update`, body);
  }

  DeleteDevise(code: any) {

    return this.http.delete(`${environment.API_Parametrage}devise/delete/`+code);
  }



  
   /// Fourniseur 

  
   GetFournisseur(): Observable<any> {

    return this.http.get(`${environment.API_Parametrage}fournisseur/all`);
  }

  PostFournisseur(body: any) {

    return this.http.post(`${environment.API_Parametrage}fournisseur`, body);
  } 
  UpdateFournisseur(body: any) {

    return this.http.put(`${environment.API_Parametrage}fournisseur/update`, body);
  }

  DeleteFournisseur(code: any) {

    return this.http.delete(`${environment.API_Parametrage}fournisseur/delete/`+code);
  }


  
  // mode reglement




  GetModeReglement(): Observable<any> {

    return this.http.get(`${environment.API_Parametrage}mode_reglement/all`);
  }

  
  GetModeReglementByCode(code:number){

    return this.http.get(`${environment.API_Parametrage}mode_reglement/`+code)
  }
  PostModeReglement(body: any) : Observable<any> {

    return this.http.post(`${environment.API_Parametrage}mode_reglement`,body)
  }
 
  UpdateModeReglement(body: any) {

    return this.http.put(`${environment.API_Parametrage}mode_reglement/update`, body);
  }

  DeleteModeReglement(code: any) {

    return this.http.delete(`${environment.API_Parametrage}mode_reglement/delete/`+code);
  }




  
  // Ville  
  GetVille(): Observable<any> { 
    return this.http.get(`${environment.API_Parametrage}ville/all`);
  }

  
  GetVilleByCode(code:number){ 
    return this.http.get(`${environment.API_Parametrage}ville/`+code)
  }
  PostVille(body: any) : Observable<any> { 
    return this.http.post(`${environment.API_Parametrage}ville`,body)
  }
 
  UpdateVille(body: any) { 
    return this.http.put(`${environment.API_Parametrage}ville/update`, body);
  }

  DeleteVille(code: any) { 
    return this.http.delete(`${environment.API_Parametrage}ville/delete/`+code);
  }


  
  // Nationaliter  
  GetNationalite(): Observable<any> { 
    return this.http.get(`${environment.API_Parametrage}nationalite/all`);
  }

  
  GetNationaliteByCode(code:number){ 
    return this.http.get(`${environment.API_Parametrage}nationalite/`+code)
  }
  PostNationalite(body: any) : Observable<any> { 
    return this.http.post(`${environment.API_Parametrage}nationalite`,body)
  }
 
  UpdateNationalite(body: any) { 
    return this.http.put(`${environment.API_Parametrage}nationalite/update`, body);
  }

  DeleteNationalite(code: any) { 
    return this.http.delete(`${environment.API_Parametrage}nationalite/delete/`+code);
  }



  
  
  //// Medecin
  GetMedecin(): Observable<any> {

    return this.http.get(`${environment.API_Parametrage}medecin/all` )
  }

  GetMedecinByCode(code:number): Observable<any> {

    return this.http.get(`${environment.API_Parametrage}medecin/`+code )
  }

  PostMedecin(body: any) {
    return this.http.post(`${environment.API_Parametrage}medecin`, body);
  } 
  UpdateMedecin(body: any) {
    return this.http.put(`${environment.API_Parametrage}medecin/update`, body);
  }

  DeleteMedecin(code: any) {
    return this.http.delete(`${environment.API_Parametrage}medecin/delete/`+code);
  }


  
   /// TypeIntervenant 

  
   GetTypeIntervenant(): Observable<any> {

    return this.http.get(`${environment.API_Parametrage}type_intervenant/all`);
  }

  PostTypeIntervenant(body: any) {

    return this.http.post(`${environment.API_Parametrage}type_intervenant`, body);
  } 
  UpdateTypeIntervenant(body: any) {

    return this.http.put(`${environment.API_Parametrage}type_intervenant/update`, body);
  }

  DeleteTypeIntervenant(code: any) {

    return this.http.delete(`${environment.API_Parametrage}type_intervenant/delete/`+code);
  }


  
   /// Societe 

  
   GetSociete(): Observable<any> {

    return this.http.get(`${environment.API_Parametrage}societe/all`);
  }

  PostSociete(body: any) {

    return this.http.post(`${environment.API_Parametrage}societe`, body);
  } 
  UpdateSociete(body: any) {

    return this.http.put(`${environment.API_Parametrage}societe/update`, body);
  }

  DeleteSociete(code: any) {

    return this.http.delete(`${environment.API_Parametrage}societe/delete/`+code);
  }


  
   /// PriceList 

  
   GetPriceList(): Observable<any> {

    return this.http.get(`${environment.API_Parametrage}price_list/all`);
  }


  GetPriceListByCode(code : number): Observable<any> {

    return this.http.get(`${environment.API_Parametrage}price_list/`+ code);
  }

  GetDetailsPriceListByCodePriceListAndCodePrestation(codePriceList : number ,codePrestation:number ): Observable<any> {

    return this.http.get(`${environment.API_Parametrage}details_price_list/By?codePrice=`+ codePriceList + `&codePrestation=`+codePrestation);
  }
  GetDetailsPriceListByCodePriceListAndCodePrestationAnd(codePriceList : number ,codePrestation:number,codeNatureAdmission:number ): Observable<any> {

    return this.http.get(`${environment.API_Parametrage}details_price_list/FindBy?codePrice=`+ codePriceList + `&codePrestation=`+codePrestation+ `&codeNatureAdmission=`+codeNatureAdmission);
  }


  PostPriceList(body: any) {

    return this.http.post(`${environment.API_Parametrage}price_list`, body);
  } 
  UpdatePriceList(body: any) {

    return this.http.put(`${environment.API_Parametrage}price_list/update`, body);
  }

  DeletePriceList(code: any) {

    return this.http.delete(`${environment.API_Parametrage}price_list/delete/`+code);
  }



  
   /// Prestation 

  
   GetPrestation(): Observable<any> {

    return this.http.get(`${environment.API_Parametrage}prestation/all`);
  }


  GetPrestationByCode(code : number): Observable<any> {

    return this.http.get(`${environment.API_Parametrage}prestation/`+ code);
  }

  // GetDetailsPriceListByCodePriceListAndCodePrestation(codePriceList : number ,codePrestation:number ): Observable<any> {

  //   return this.http.get(`${environment.API_Parametrage}details_price_list/By?codePrice=`+ codePriceList + `&codePrestation=`+codePrestation);
  // }
  // GetDetailsPriceListByCodePriceListAndCodePrestationAnd(codePriceList : number ,codePrestation:number,codeNatureAdmission:number ): Observable<any> {

  //   return this.http.get(`${environment.API_Parametrage}details_price_list/FindBy?codePrice=`+ codePriceList + `&codePrestation=`+codePrestation+ `&codeNatureAdmission=`+codeNatureAdmission);
  // }


  PostPrestation(body: any) {

    return this.http.post(`${environment.API_Parametrage}prestation`, body);
  } 
  UpdatePrestation(body: any) {

    return this.http.put(`${environment.API_Parametrage}prestation/update`, body);
  }

  DeletePrestation(code: any) {

    return this.http.delete(`${environment.API_Parametrage}prestation/delete/`+code);
  }





}
