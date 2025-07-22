import "@/scss/home.scss";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Swiper from "swiper";
import {
  Pagination,
  Grid,
  Navigation,
  EffectFade,
  Autoplay,
  EffectFlip,
  EffectCube,
} from "swiper/modules";
// @ts-ignore
import "swiper/css";
// @ts-ignore
import "swiper/css/pagination";
// @ts-ignore
import "swiper/css/grid";
// @ts-ignore
import "swiper/css/effect-fade";
// @ts-ignore
import "swiper/css/effect-flip";
// @ts-ignore
import "swiper/css/effect-cube";
// @ts-ignore
import "swiper/css/autoplay";

import { QuestionToggler } from "./QuestionToggler";

// import IconFoo from './../assets/icons/foo.svg';
// const html = `
//   <svg>
//     <use xlink:href="#${IconFoo}" />
//   </svg>
// `;

gsap.registerPlugin(ScrollTrigger);

ScrollTrigger.config({
  autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
});

// После gsap.registerPlugin(ScrollTrigger)
gsap.defaults({
  // force3D: false, // Отключает автоматическое 3D-преобразование
  // transformPerspective: 1000 // Фиксирует перспективу для 3D-элементов
});

class Tabs {
  private tabs: HTMLElement;
  private buttons: NodeListOf<HTMLElement>;
  private panels: NodeListOf<HTMLElement>;
  private indicator: HTMLElement;

  constructor(selector: string = ".tabs") {
    this.tabs = document.querySelector(selector)!;
    this.buttons = this.tabs.querySelectorAll(".tabs__btn");
    this.panels = this.tabs.querySelectorAll(".tabs__panel");
    this.indicator = this.tabs.querySelector(".tabs__indicator")!;
    this.init();
  }

  private init(): void {
    this.setIndicatorPosition(this.buttons[0]);
    this.buttons.forEach((btn) => {
      btn.addEventListener("click", () => this.switchTab(btn));
    });
  }

  private switchTab(activeBtn: HTMLElement): void {
    gsap.to(this.buttons, {
      paddingLeft: 20,
      duration: 0.3,
      onStart: () => {
        this.buttons.forEach((btn) => btn.classList.remove("active"));
      },
    });

    gsap.to(activeBtn, {
      paddingLeft: 45,
      duration: 0.3,
      onStart: () => {
        activeBtn.classList.add("active");
      },
      onComplete: () => this.setIndicatorPosition(activeBtn),
    });

    const targetPanel = this.tabs.querySelector(
      `.tabs__panel[data-tab="${activeBtn.dataset.tab}"]`
    ) as HTMLElement;
    gsap.to(this.panels, {
      opacity: 0,
      x: -2000,
      duration: 0.2,
      onComplete: () => {
        gsap.fromTo(
          targetPanel,
          { x: 20, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.3 }
        );
      },
    });
  }

  private setIndicatorPosition(btn: HTMLElement): void {
    gsap.to(this.indicator, {
      width: btn.offsetWidth,
      x: btn.offsetLeft,
      duration: 0.3,
      ease: "power2.out",
    });
  }
}

class CasesSlider {
  private sliders: Map<string, Swiper> = new Map();

  private initTabSlider(tabId: string) {
    const panel = document.querySelector(`.tabs__panel[data-tab="${tabId}"]`);
    if (!panel) return;

    const swiperEl = panel.querySelector<HTMLElement>(".swiper");
    const paginationEl = panel.querySelector<HTMLElement>(
      ".swiper__pagination"
    );
    const prevEl = panel.querySelector<HTMLElement>(".swiper__arrow_prev");
    const nextEl = panel.querySelector<HTMLElement>(".swiper__arrow_next");

    if (!swiperEl || !paginationEl || !prevEl || !nextEl) return;

    swiperEl.style.opacity = "1";
    swiperEl.style.visibility = "visible";

    const swiper = new Swiper(swiperEl, {
      modules: [Pagination, Navigation, Grid],
      slidesPerView: 4,
      grid: {
        rows: 3,
        fill: "row",
      },
      slidesPerGroup: 4,
      spaceBetween: 24,
      navigation: {
        prevEl: prevEl,
        nextEl: nextEl,
      },
      pagination: {
        el: paginationEl,
        type: "bullets",
        clickable: true,
        dynamicBullets: true,
        dynamicMainBullets: 1,
        hideOnClick: false,
      },
      observer: true,
      observeParents: true,
      init: false,
      breakpoints: {
        // when window width is >= 1024px - default settings (4 columns, 3 rows)
        1024: {
          slidesPerView: 4,
          grid: {
            rows: 3,
            fill: "row",
          },
          slidesPerGroup: 4,
        },
        // when window width is >= 768px and < 1024px - 2 columns, 2 rows
        768: {
          slidesPerView: 2,
          grid: {
            rows: 2,
            fill: "row",
          },
          slidesPerGroup: 2,
          spaceBetween: 20,
        },
        // when window width is < 768px (mobile) - 1 column, 2 rows
        320: {
          slidesPerView: 1,
          grid: {
            rows: 2,
            fill: "row",
          },
          slidesPerGroup: 1,
          spaceBetween: 15,
        },
      },
    });

    swiper.init();
    this.sliders.set(tabId, swiper);
  }

  constructor() {
    this.initSwipers();
    this.setupTabHandlers();
  }

  private initSwipers() {
    ["tab1", "tab2", "tab3", "tab4"].forEach((tabId) => {
      this.initTabSlider(tabId);
    });
  }

  private setupTabHandlers() {
    document.querySelectorAll(".tabs__btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const tabId = btn.getAttribute("data-tab");
        if (tabId && this.sliders.has(tabId)) {
          const swiper = this.sliders.get(tabId)!;
          setTimeout(() => {
            swiper.update();
            swiper.slideTo(0);
          }, 50);
        }
      });
    });
  }
}

class StudentResults {
  private grid: HTMLElement;
  private inner: HTMLElement;
  private toggleBtn: HTMLElement | null;
  private isExpanded = false;
  private initialHeight: number;

  constructor(grid: HTMLElement) {
    this.grid = grid;
    this.inner = grid.querySelector(".student-results__inner")!;
    this.toggleBtn = grid.querySelector(".student-results__show-more");
    this.initialHeight = this.calcInitialHeight();

    if (this.toggleBtn) {
      this.init();
    }
  }

  private init() {
    this.setupGrid();
    this.toggleBtn!.addEventListener("click", () => this.toggleGrid());
  }

  private setupGrid() {
    this.inner.style.height = `${this.initialHeight}px`;
  }

  private calcInitialHeight(): number {
    const item = this.inner.children[0] as HTMLElement;
    if (!item) return 0;

    const gap = 95;
    const rows = parseInt(this.grid.dataset.initialRows || "2");
    return item.offsetHeight * rows + gap * (rows - 1) + 50;
  }

  private toggleGrid() {
    this.isExpanded = !this.isExpanded;

    gsap.to(this.inner, {
      height: this.isExpanded ? this.inner.scrollHeight : this.initialHeight,
      duration: 0.5,
      ease: "power2.inOut",
      onComplete: () => {
        if (this.isExpanded) {
          this.inner.style.height = "auto";
        }
      },
    });

    const buttonText = this.isExpanded ? "Свернуть" : "Показать ещё";
    const buttonSpan = this.toggleBtn?.querySelector("span");
    if (buttonSpan) {
      buttonSpan.textContent = buttonText;
    }
  }
}

const initIntersectionObservers = () => {
  document.querySelectorAll(".wave-text").forEach((element) => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.target instanceof HTMLElement) {
          entry.target.style.transition = "0.4s all ease-in-out";
          entry.target.classList.remove("wave-text");
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.8 }
    );
    observer.observe(element);
  });

  document.querySelectorAll(".observe-remove").forEach((element) => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.target instanceof HTMLElement) {
          entry.target.classList.remove("observe-remove");
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.8 }
    );
    observer.observe(element);
  });
};

const initSpiralAnimations = () => {
  const leftSpiral = document.querySelector(
    ".from-scratch-to-pro__background-left img"
  );
  const rightSpiral = document.querySelector(
    ".from-scratch-to-pro__background-right img"
  );

  if (!leftSpiral || !rightSpiral) return;

  gsap.from(leftSpiral, {
    y: 30,
    opacity: 0,
    scale: 0.95,
    duration: 1.2,
    ease: "elastic.out(1, 0.4)",
    scrollTrigger: {
      trigger: leftSpiral,
      start: "top 70%",
      once: true,
      toggleActions: "play none none reverse",
    },
  });

  gsap.from(rightSpiral, {
    y: -30,
    opacity: 0,
    scale: 0.95,
    duration: 1.2,
    ease: "elastic.out(1, 0.4)",
    scrollTrigger: {
      trigger: rightSpiral,
      start: "top 85%",
      once: true,
      toggleActions: "play none none reverse",
    },
  });
};

const initCircleModule = () => {
  const startDeg = -60;
  const container = document.querySelector(
    "#real-pros__container"
  ) as HTMLElement;
  const containerClientWidth = container.clientWidth;
  const radius = containerClientWidth / 2;
  const cards = gsap.utils.toArray<HTMLElement>(".real-pros__card");
  const angleBetween = 7;
  const finalDeg = -30;

  const circleTL = gsap.timeline({
    scrollTrigger: {
      trigger: "#real-pros",
      start: "top top",
      end: `+=${1000}`,
      scrub: 0.7,
      pin: true,
      anticipatePin: 1,
      markers: false,
      id: "circle-timeline",
    },
  });

  cards.forEach((card, i) => {
    const startAngleDeg =
      i % 2 == 0
        ? startDeg + i * -angleBetween
        : startDeg + 180 + i * -angleBetween;
    const startAngleRad = (startAngleDeg * Math.PI) / 180;

    gsap.set(card, {
      x: Math.cos(startAngleRad) * radius,
      y: Math.sin(startAngleRad) * radius,
    });

    circleTL.to(
      card,
      {
        rotate: -startDeg - finalDeg,
        duration: 1,
        ease: "none",
      },
      0.1
    );
  });

  circleTL.to(
    container,
    {
      rotate: finalDeg + startDeg,
      duration: 1,
      ease: "none",
    },
    0.1
  );
};

const initBurgerMenu = () => {
  // Элементы для PC версии
  const burgerPc = document.querySelector<HTMLElement>("#burger-pc");
  const burgerIconPc = burgerPc?.querySelector<HTMLElement>(".burger");
  const coursesBlock = document.querySelector<HTMLElement>(".header__courses");
  let isCoursesVisible = false;

  // Элементы для Mobile версии
  const burgerMobile = document.querySelector<HTMLElement>("#burger-mobile");
  const burgerIconMobile = burgerMobile?.querySelector<HTMLElement>(".burger");
  const burgerTextMobile = burgerMobile?.querySelector<HTMLElement>(
    ".header__burger-text"
  );
  const mobileContent = document.querySelector<HTMLElement>(
    ".header__mobile-content"
  );
  const headerMobile = document.querySelector<HTMLElement>(".header__mobile");

  let isMobileContentVisible = false;

  // Общие элементы
  const hamburgerInput = document.querySelector<HTMLInputElement>(
    '.hamburger input[type="checkbox"]'
  );
  const blurBackground = document.getElementById("background-blur");

  // Анимация для блока курсов (PC)
  const animateCourses = () => {
    if (!coursesBlock) return;

    if (isCoursesVisible) {
      gsap.to(coursesBlock, {
        height: 0,
        duration: 0.3,
        ease: "power2.inOut",
        onComplete: () => {
          coursesBlock.style.display = "none";
        },
      });
    } else {
      coursesBlock.style.display = "block";
      gsap.fromTo(
        coursesBlock,
        { height: 0 },
        {
          height: "auto",
          duration: 0.3,
          ease: "power2.inOut",
        }
      );
    }
    isCoursesVisible = !isCoursesVisible;
  };

  // Анимация для мобильного контента
  const animateMobileContent = () => {
    if (!mobileContent || !headerMobile) return;

    if (isMobileContentVisible) {
      headerMobile.style.height = "auto";
      gsap.to(mobileContent, {
        height: 0,
        duration: 0.3,
        ease: "power2.inOut",
        onComplete: () => {
          mobileContent.style.display = "none";
        },
      });
    } else {
      mobileContent.style.display = "flex";
      headerMobile.style.height = "100vh";
      gsap.fromTo(
        mobileContent,
        { height: 0 },
        {
          height: "100vh",
          duration: 0.3,
          ease: "power2.inOut",
        }
      );
    }
    isMobileContentVisible = !isMobileContentVisible;
  };

  // Обработчик для PC бургера
  burgerPc?.addEventListener("click", (e) => {
    e.stopPropagation();
    burgerIconPc?.classList.toggle("active");
    blurBackground?.classList.toggle("active");
    animateCourses();
  });

  // Обработчик для Mobile бургера
  burgerMobile?.addEventListener("click", (e) => {
    e.stopPropagation();
    const isActivating = !burgerIconMobile?.classList.contains("active");
    burgerIconMobile?.classList.toggle("active");
    blurBackground?.classList.toggle("active");
    if (burgerTextMobile) {
      burgerTextMobile.textContent = isActivating ? "Закрыть" : "Меню";
    }
    animateMobileContent();
  });

  // Закрытие по клику вне области
  document.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;

    if (
      isCoursesVisible &&
      !coursesBlock?.contains(target) &&
      !burgerPc?.contains(target)
    ) {
      burgerIconPc?.classList.remove("active");
      blurBackground?.classList.remove("active");
      animateCourses();
    }

    if (
      isMobileContentVisible &&
      !mobileContent?.contains(target) &&
      !burgerMobile?.contains(target)
    ) {
      burgerIconMobile?.classList.remove("active");
      blurBackground?.classList.remove("active");
      animateMobileContent();
    }
  });

  // Закрытие по клику вне области (опционально)
  document.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;

    if (
      isCoursesVisible &&
      !coursesBlock?.contains(target) &&
      !burgerPc?.contains(target)
    ) {
      animateCourses();
      if (hamburgerInput?.checked) {
        hamburgerInput.checked = false;
        hamburgerInput.dispatchEvent(new Event("change"));
        blurBackground?.classList.remove("active");
      }
    }

    if (
      isMobileContentVisible &&
      !mobileContent?.contains(target) &&
      !burgerMobile?.contains(target)
    ) {
      animateMobileContent();
      if (hamburgerInput?.checked) {
        hamburgerInput.checked = false;
        hamburgerInput.dispatchEvent(new Event("change"));
        blurBackground?.classList.remove("active");
      }
    }
  });
};

const initHeaderScroll = () => {
  const header = document.querySelector<HTMLElement>("header");
  if (!header) return;

  const throttle = (fn: Function, delay: number) => {
    let lastCall = 0;
    return (...args: any[]) => {
      const now = new Date().getTime();
      if (now - lastCall < delay) return;
      lastCall = now;
      return fn(...args);
    };
  };

  const handleScroll = throttle(() => {
    header.classList.toggle("scroll", window.scrollY > 100);
  }, 100);

  handleScroll();
  window.addEventListener("scroll", handleScroll);
};

const initHeroSlider = () => {
  new Swiper("#heroSlider", {
    modules: [Pagination, Autoplay, EffectFade, EffectFlip, EffectCube],
    loop: true,
    effect: "fade",
    speed: 1500,
    fadeEffect: {
      crossFade: true,
    },
    cubeEffect: {
      shadow: true,
      slideShadows: true,
      shadowOffset: 20,
      shadowScale: 0.94,
    },
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
      waitForTransition: true,
    },
    pagination: {
      el: ".hero__pagination",
      clickable: true,
      bulletClass: "hero__bullet",
      bulletActiveClass: "hero__bullet--active",
      renderBullet: function (index, className) {
        const labels = [
          "3D дизайн",
          "UX / UI дизайн",
          "Граф. дизайн",
          "Маркетплейсы",
          "AI дизайн",
        ];
        return `
          <div class="side-media row gradient-border ${className}">
            <div class="green-arrow side-media__img">
              <img src="./assets/images/hero-pagination/${
                index + 1
              }.svg" alt="${labels[index]}"/>
            </div>
            <div class="side-media__text">${labels[index]}</div>
          </div>
        `;
      },
    },
  });
};

const initImageBlurEffect = () => {
  const imageContainer = document.querySelector(
    ".image__container"
  ) as HTMLElement;
  const parentElement = document.querySelector(".advantages") as HTMLElement;

  gsap.to(imageContainer, {
    filter: "blur(10px)",
    scrollTrigger: {
      trigger: parentElement,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
    },
  });
};

const initStudentResults = () => {
  document.querySelectorAll(".student-results__content").forEach((grid) => {
    const inner = grid.querySelector(".student-results__inner");
    if (inner) {
      new StudentResults(grid as HTMLElement);
    }
  });
};

const initMobileCoursesNavigation = () => {
  console.log("Функция initMobileCoursesNavigation вызвана");

  // Получаем элементы
  console.log("Поиск элементов...");
  const mobileBackButton = document.querySelector<HTMLElement>(
    ".header__mobile-back"
  );
  const viewCourseButton = document.querySelector<HTMLElement>("#view-course");
  const mobileCourses = document.querySelector<HTMLElement>(
    ".header__mobile-curses"
  );

  console.log("Найденные элементы:", {
    mobileBackButton,
    viewCourseButton,
    mobileCourses,
  });

  // Проверяем, что элементы существуют
  if (!mobileBackButton) {
    console.error("Элемент .header__mobile-back не найден");
    return;
  }
  if (!viewCourseButton) {
    console.error("Элемент #view-course не найден");
    return;
  }
  if (!mobileCourses) {
    console.error("Элемент .header__mobile-curses не найден");
    return;
  }

  console.log("Все элементы найдены, инициализация анимаций...");

  // Функция для скрытия курсов (уводит вправо)
  const hideCourses = () => {
    console.log("Вызвана функция hideCourses");
    gsap.to(mobileCourses, {
      x: "300%",
      duration: 0.5,
      ease: "power2.inOut",
      onComplete: () => console.log("Анимация hideCourses завершена"),
    });
  };

  // Функция для показа курсов (возвращает на место)
  const showCourses = () => {
    console.log("Начальные стили элемента:", {
      transform: getComputedStyle(mobileCourses).transform,
      visibility: getComputedStyle(mobileCourses).visibility,
      display: getComputedStyle(mobileCourses).display,
      opacity: getComputedStyle(mobileCourses).opacity,
    });

    gsap.to(mobileCourses, {
      x: "0%",
      duration: 0.5,
      ease: "power2.inOut",
      onUpdate: () => {
        console.log("Текущие координаты:", {
          x: gsap.getProperty(mobileCourses, "x"),
          matrix: getComputedStyle(mobileCourses).transform,
        });
      },
      onComplete: () => {
        console.log(
          "Финальные стили элемента:",
          getComputedStyle(mobileCourses).transform
        );
        console.log(
          "GSAP состояние анимации:",
          gsap.getTweensOf(mobileCourses)
        );
      },
    });
  };

  // Обработчики событий
  console.log("Добавление обработчиков событий...");
  mobileBackButton.addEventListener("click", (e) => {
    console.log("Клик по mobileBackButton", e);
    hideCourses();
  });

  viewCourseButton.addEventListener("click", (e) => {
    console.log("Клик по viewCourseButton", e);
    showCourses();
  });

  // Проверяем доступность GSAP

  // Инициализация - скрываем курсы при загрузке (если нужно)
  console.log("Инициализация начального состояния...");
  gsap.set(mobileCourses, { clearProps: "transform" });
  gsap.set(mobileCourses, {
    x: "300%",
    onComplete: () => console.log("Начальное состояние установлено"),
  });

  console.log("Инициализация завершена успешно");
};

// Проверяем, вызывается ли функция вообще
// console.log("Запуск инициализации мобильной навигации...");
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM полностью загружен");
  initMobileCoursesNavigation();
});

const initRectangleAnimation = () => {
  // Кэшируем элементы
  const elements = {
    rect: document.querySelector(".rectangle") as HTMLElement,
    circles: [
      document.querySelector("#circle-1") as SVGCircleElement,
      document.querySelector("#circle-2") as SVGCircleElement,
      document.querySelector("#circle-3") as SVGCircleElement,
    ],
    progressBarsBg: [
      document.querySelector("#progress-barr-3") as SVGCircleElement,
      document.querySelector("#progress-barr-2") as SVGCircleElement,
      document.querySelector("#progress-barr-1") as SVGCircleElement,
    ],
    progressBars: [
      document.querySelector("#progress-barr-3-green") as SVGCircleElement,
      document.querySelector("#progress-barr-2-green") as SVGCircleElement,
      document.querySelector("#progress-barr-1-green") as SVGCircleElement,
    ],
  };

  // Проверка элементов с более чистым выводом
  if (!validateElements(elements)) return;

  // Настройка прогресс-баров
  const { barLengths } = setupProgressBars(
    elements.progressBarsBg,
    elements.progressBars
  );

  // Конфигурация анимации
  const config = {
    rectangleTime: 1500,
    totalDuration: 2,
    offset: calculateOffset(),
  };

  // Создаем timeline
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".from-scratch-to-pro",
      start: "top top",
      end: `+=${config.rectangleTime}`,
      scrub: true,
      pin: true,
      markers: false,
      id: "main-timeline",
    },
  });

  // Анимация прямоугольника
  tl.to(
    elements.rect,
    {
      width: "100%",
      height: "100%",
      ease: "none",
      duration: 1,
      transformStyle: "flat",
      // force3D: false,
    },
    0
  );

  // Анимация кругов
  animateCircles(tl);

  // Анимация карточек
  tl.to(
    ".from-scratch-to-pro__cards",
    {
      transform: `translate(-50%, ${config.offset}%)`,
      duration: 2,
      ease: "none",
      force3D: false,
      transformStyle: "flat",
    },
    0.7
  );

  // Анимация прогресс-баров
  animateProgressBars(
    tl,
    elements.progressBars,
    barLengths,
    config.totalDuration
  );
};

// Вспомогательные функции
function validateElements(elements: any): boolean {
  const missing = [];
  if (!elements.rect) missing.push("Rectangle element (.rectangle)");
  elements.circles.forEach((circle: HTMLElement, i: number) => {
    if (!circle) missing.push(`Circle #${i + 1} (#circle-${i + 1})`);
  });
  elements.progressBarsBg.forEach((bar: HTMLElement, i: number) => {
    if (!bar)
      missing.push(
        `Progress bar background #${i + 1} (#progress-barr-${i + 1})`
      );
  });
  elements.progressBars.forEach((bar: HTMLElement, i: number) => {
    if (!bar)
      missing.push(`Progress bar #${i + 1} (#progress-bar-${i + 1}-green)`);
  });

  if (missing.length) {
    console.log("Missing elements:", missing.join(", "));
    return false;
  }
  return true;
}

function setupProgressBars(
  bgBars: SVGCircleElement[],
  progressBars: SVGCircleElement[]
) {
  const startAngles = [0, 0, 0];
  const endAngles = [24, 48, 28];

  bgBars.forEach((bar, i) => {
    const radius = parseFloat(bar.getAttribute("r")!);
    const circumference = 2 * Math.PI * radius;
    const arcLength = ((endAngles[i] - startAngles[i]) / 360) * circumference;
    const startOffset = (startAngles[i] / 360) * circumference;

    bar.setAttribute(
      "stroke-dasharray",
      `${arcLength} ${circumference - arcLength}`
    );
    bar.setAttribute("stroke-dashoffset", `${startOffset}`);
  });

  return {
    barLengths: progressBars.map((bar, i) => {
      const radius = parseFloat(bar.getAttribute("r")!);
      const circumference = 2 * Math.PI * radius;
      const arcLength = ((endAngles[i] - startAngles[i]) / 360) * circumference;
      const startOffset = (startAngles[i] / 360) * circumference;

      bar.setAttribute("stroke-dasharray", `0 ${circumference}`);
      bar.setAttribute("stroke-dashoffset", `${startOffset}`);

      return { circumference, arcLength, startOffset };
    }),
  };
}

function calculateOffset(): number {
  const wrapper = document.querySelector(
    ".from-scratch-to-pro__cards"
  ) as HTMLElement;
  const card = document.querySelector(
    ".from-scratch-to-pro__card-section"
  ) as HTMLElement;
  const rect = document.querySelector(".circle-section") as HTMLElement;

  if (!wrapper || !card || !rect) return 0;

  return (
    ((card.offsetHeight - rect.offsetHeight) / 2 / wrapper.offsetHeight) * 100
  );
}

function animateCircles(tl: gsap.core.Timeline) {
  const circleAnim = (id: string) => {
    return gsap.timeline().to(id, {
      strokeDashoffset: 0,
      duration: 0.25,
      ease: "none",
      force3D: false,
    });
  };

  tl.add(circleAnim("#circle-1"), "<0.25")
    .add(circleAnim("#circle-2"), ">")
    .add(circleAnim("#circle-3"), ">");
}

function animateProgressBars(
  tl: gsap.core.Timeline,
  progressBars: SVGCircleElement[],
  barLengths: any[],
  totalDuration: number
) {
  // Порядок анимации: [2, 1, 0] - соответствует [3, 2, 1] в оригинале
  const animationOrder = [2, 1, 0];
  const durations = [0.4, 0.4, 0.2];
  const delays = [0.7, 0.7 + totalDuration * 0.4, 0.7 + totalDuration * 0.8];

  animationOrder.forEach((barIndex, i) => {
    tl.to(
      progressBars[barIndex],
      {
        strokeDasharray: `${barLengths[barIndex].arcLength} ${
          barLengths[barIndex].circumference - barLengths[barIndex].arcLength
        }`,
        duration: durations[i],
        ease: "none",
        force3D: false,
      },
      delays[i]
    );
  });
}

document
  .querySelectorAll(".mobile-slider")
  .forEach((sliderContainer, index) => {
    console.log(`[Slider ${index}] Начинаем инициализацию`);

    const swiperEl = sliderContainer.querySelector(
      ".swiper"
    ) as HTMLElement | null;
    const paginationEl = sliderContainer.querySelector(
      ".swiper-pagination"
    ) as HTMLElement | null;

    console.log(`[Slider ${index}] Элемент .swiper найден?`, !!swiperEl);
    console.log(
      `[Slider ${index}] Элемент .swiper-pagination найден?`,
      !!paginationEl
    );

    if (!swiperEl) {
      console.warn(`[Slider ${index}] Не найден элемент .swiper`);
      return;
    }

    if (!paginationEl) {
      console.warn(`[Slider ${index}] Не найден элемент .swiper-pagination`);
      return;
    }

    console.log(
      `[Slider ${index}] Инициализируем Swiper с элементом:`,
      swiperEl
    );

    try {
      new Swiper(swiperEl, {
        modules: [Pagination, Autoplay, EffectFade, EffectFlip, EffectCube],
        slidesPerView: 1,
        spaceBetween: 16,
        loop: false,
        autoHeight: false,
        pagination: {
          el: paginationEl,
          bulletElement: "span",
          clickable: true,
        },
      });
      console.log(`[Slider ${index}] Swiper успешно инициализирован`);
    } catch (error) {
      console.error(
        `[Slider ${index}] Ошибка при инициализации Swiper:`,
        error
      );
    }
  });

document.addEventListener("DOMContentLoaded", () => {
  initIntersectionObservers();
  function checkAndInitAnimation() {
    if (window.innerWidth > 700) {
      initRectangleAnimation();
      initSpiralAnimations();
    }
  }

  // Вызываем при загрузке страницы
  checkAndInitAnimation();

  // Опционально: вызывать при изменении размера окна (если пользователь ресайзит)
  window.addEventListener("resize", checkAndInitAnimation);

  initCircleModule();
  initBurgerMenu();
  initHeaderScroll();
  initHeroSlider();
  initImageBlurEffect();
  initStudentResults();

  new Tabs();
  new CasesSlider();
  new QuestionToggler();
});
