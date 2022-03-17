import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private annee: string | null = '';
  private ressource: string = '';
  private majeure: string = '';
  private matiere: string = '';

  constructor() {
    this.annee = JSON.parse(localStorage.getItem('annee')!);
    this.ressource = JSON.parse(localStorage.getItem('ressource')!);
    this.majeure = JSON.parse(localStorage.getItem('majeure')!);
    this.matiere = JSON.parse(localStorage.getItem('matiere')!);
  }

  getAnnee() {
    return this.annee;
  }

  setAnnee(annee: string) {
    localStorage.setItem('annee', JSON.stringify(annee));
    this.annee = annee;
  }

  getRessource() {
    return this.ressource;
  }

  setRessource(ressource: string) {
    localStorage.setItem('ressource', JSON.stringify(ressource));
    this.ressource = ressource;
  }

  getMajeure() {
    return this.majeure;
  }

  setMajeure(majeure: string) {
    localStorage.setItem('majeure', JSON.stringify(majeure));
    this.majeure = majeure;
  }

  getMatiere() {
    return this.matiere;
  }

  setMatiere(matiere: string) {
    localStorage.setItem('matiere', JSON.stringify(matiere));
    this.matiere = matiere;
  }
}
