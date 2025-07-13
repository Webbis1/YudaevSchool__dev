import { gsap } from 'gsap';  

export class StudentResults {  
  private grid: HTMLElement;  
  private inner: HTMLElement;  
  private toggleBtn: HTMLElement;  
  private isExpanded = false;  

  constructor(grid: HTMLElement) {  
    this.grid = grid;  
    this.inner = grid.querySelector('.student-results__inner')!;  
    this.toggleBtn = grid.querySelector('.student-results__show-more')!;  
    this.init();  
  }  

  private init() {  
    this.setupGrid();  
    this.toggleBtn.addEventListener('click', () => this.toggleGrid());  
  }  

  private setupGrid() {  
    const columns = this.grid.dataset.columns || '3';  
    this.inner.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;  
  }  

  private toggleGrid() {  
    this.isExpanded = !this.isExpanded;  
    gsap.to(this.inner, {  
      height: this.isExpanded ? 'auto' : 'calc(2 * (100% / 3))', // 2 строки  
      duration: 0.5,  
      ease: 'power2.inOut'  
    });  
  }  
}  

document.querySelectorAll('.student-results').forEach((grid) => {  
  new StudentResults(grid as HTMLElement);  
});  