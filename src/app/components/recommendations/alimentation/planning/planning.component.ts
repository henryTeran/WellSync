import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonContent, IonFooter, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { addIcons } from 'ionicons';
import { arrowBackOutline, documentOutline } from 'ionicons/icons';
import Swiper from 'swiper';

const elementsUi = [
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonIcon,
];
@Component({
  selector: 'app-planning',
  standalone: true,
  imports: [...elementsUi, RouterLink],
  templateUrl: './planning.component.html',
  styleUrls: ['./planning.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PlanningComponent implements OnInit {
  @Input() recommendation: any;
  private _swiperRef!: ElementRef;
  @ViewChild('swiper') set swiper(val: ElementRef) {
  if (val?.nativeElement?.swiper) {
    this._swiperRef = val;
  }
}
  currentSlideIndex = 0;
  currentStep = 0; // Define currentStep with an initial value

  constructor(private route: ActivatedRoute, private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    addIcons({ arrowBackOutline, documentOutline });
    if (navigation?.extras.state?.['recommendation']) {
      this.recommendation = navigation.extras.state['recommendation'];
    }
  }

  ngOnInit() {
    const navigation = history.state;
    if (navigation && navigation.recommendation) {
      this.recommendation = navigation.recommendation;
    }
  }

  onSlideChange(event: any) {
    this.currentSlideIndex = event.detail?.activeIndex ?? 0;
    this.currentStep = this.currentSlideIndex;
  }

  async nextSlide() {
    const swiper = this._swiperRef?.nativeElement.swiper as Swiper;
    if (swiper && swiper.slideNext) {
      await swiper.slideNext();
      this.currentSlideIndex = swiper.activeIndex;
      this.currentStep = swiper.activeIndex;
      }
    }

  async prevSlide() {
    const swiper = this._swiperRef?.nativeElement.swiper as Swiper;
    if (swiper && swiper.slidePrev) {
      await swiper.slidePrev();
      this.currentSlideIndex = swiper.activeIndex;
      this.currentStep = swiper.activeIndex;
      }
    }

  exporterPDF() {
    if (!this.recommendation) return;
  
    const doc = new jsPDF();

     // Créer un objet Image
    const img = new Image();
    img.src = 'assets/icons/my-logo-96x96.png'; // Chemin relatif à ton dossier /src/assets/

    img.onload = () => {
      doc.addImage(img, 'PNG', 10, 5, 15, 15);

      // Logo texte
      doc.setFontSize(22);
      doc.setTextColor(33, 150, 83); // vert WellSync
      doc.text('          WellSync', 10, 15);
    
      doc.setFontSize(15);
      doc.setTextColor(0, 0, 0);
      doc.text(this.recommendation?.titre || 'Plan Alimentaire', 10, 25);
    
      // Description
      doc.setFontSize(11);
      doc.setTextColor(50, 50, 50);
      const descLines = doc.splitTextToSize(this.recommendation?.description || '', 180);
      doc.text(descLines, 10, 35);
    
      // Bienfaits
      const descHeight = 35 + (descLines.length * 6);
      doc.setTextColor(30, 30, 30);
      doc.setFontSize(11);
      doc.text(' Bienfaits :', 10, descHeight);
      const bienfaitsLines = doc.splitTextToSize(this.recommendation?.bienfaits || '', 180);
      doc.text(bienfaitsLines, 10, descHeight + 6);
    
      let y = descHeight + 15 + bienfaitsLines.length * 6;
    
      for (const day of this.recommendation?.jours || []) {
        const repasDuJour = day.repas.map((meal:any)  => [
          ` ${meal.nom}`,
          meal.ingredients?.join(', ') || '-',
          meal.instructions ? doc.splitTextToSize(meal.instructions, 60).join('\n') : '-'
        ]);
    
        doc.setFontSize(13);
        doc.setTextColor(22, 110, 138);
        doc.text(` ${day.jour}`, 10, y);
    
        autoTable(doc, {
          startY: y + 3,
          head: [['Repas', 'Ingrédients', 'Préparation']],
          body: repasDuJour,
          styles: {
            fontSize: 9,
            cellPadding: 2,
            overflow: 'linebreak'
          },
          headStyles: {
            fillColor: [41, 128, 185],
            textColor: 255,
            halign: 'center'
          },
          alternateRowStyles: {
            fillColor: [248, 248, 248]
          },
          columnStyles: {
            0: { cellWidth: 50 },
            1: { cellWidth: 60 },
            2: { cellWidth: 70 }
          },
          margin: { left: 10, right: 10 }
        });
    
        y = (doc as any).lastAutoTable.finalY + 10;
    
        if (y > 260) {
          doc.addPage();
          y = 20;
        }
      }
    
      // Pied de page
      doc.setFontSize(9);
      doc.setTextColor(120);
      doc.text('Généré par WellSync', 70, 290);
    
      doc.save('Plan_Alimentaire_WellSync_PRO.pdf');
    }
  }

  get backgroundClass(): string {
    return `background-slide-${this.currentStep + 1}`;
  }
}
