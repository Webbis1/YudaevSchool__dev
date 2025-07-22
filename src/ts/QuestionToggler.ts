import { gsap } from "gsap";

export class QuestionToggler {
  private questions: HTMLElement[];

  constructor() {
    this.questions = Array.from(
      document.querySelectorAll(".questions__question")
    );
    this.initEvents();
  }

  private initEvents(): void {
    this.questions.forEach((question) => {
      const header = question.querySelector(".question__header");
      const details = question.querySelector(
        ".question__details"
      ) as HTMLElement;
      const arrow = question.querySelector(".faq__open");

      header?.addEventListener("click", () => {
        const isActive = question.classList.contains("question--active");

        if (isActive) {
          // Закрываем
          gsap.to(details, {
            height: 0,
            duration: 0.3,
            ease: "power1.out",
            onComplete: () => {
              question.classList.remove("question--active");
            },
          });

          gsap.to(arrow, {
            rotation: 0,
            duration: 0.3,
          });
        //   question.classList.remove("active");
        } else {
          // Открываем
          question.classList.add("question--active");
          gsap.fromTo(
            details,
            { height: 0 },
            {
              height: "auto",
              duration: 0.3,
              ease: "power1.out",
            }
          );

          gsap.to(arrow, {
            rotation: 45,
            duration: 0.3,
          });
        //   question.classList.add("active");
        }
      });
    });
  }
}
