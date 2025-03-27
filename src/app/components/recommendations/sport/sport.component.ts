import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Firestore, collection, query, where, orderBy, limit, getDocs } from '@angular/fire/firestore';
import { AuthService } from '../../../core/services/auth.service';
import { SportRecommendation } from '../../../core/interfaces';


@Component({
  selector: 'app-sport',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sport.component.html',
  styleUrl: './sport.component.css'
})
export class SportComponent implements OnInit {
  userId: string | null = null;
  recommendation: SportRecommendation | null = null;

  constructor(private firestore: Firestore, private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.user$.subscribe(async (user) => {
      if (user?.uid) {
        this.userId = user.uid;
        await this.loadRecommendation();
      }
    });
  }

  async loadRecommendation() {
    if (!this.userId) return;

    const ref = collection(this.firestore, `users/${this.userId}/recommendations`);
    const q = query(ref, where('theme', '==', 'sport'), orderBy('date', 'desc'), limit(1));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      this.recommendation = snapshot.docs[0].data() as SportRecommendation;
    }
  }
}
