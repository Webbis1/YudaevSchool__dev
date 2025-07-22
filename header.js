const initMobileCoursesNavigation = () => {
    console.log("Функция initMobileCoursesNavigation вызвана");

    const mobileBackButton = document.querySelector(".header__mobile-back");
    const viewCourseButton = document.querySelector("#view-course");
    const mobileCourses = document.querySelector(".header__mobile-curses");

    console.log("Найденные элементы:", {
        mobileBackButton,
        viewCourseButton,
        mobileCourses,
    });

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

    const hideCourses = () => {
        console.log("Вызвана функция hideCourses");
        gsap.to(mobileCourses, {
            x: "300%",
            duration: 0.5,
            ease: "power2.inOut",
            onComplete: () => console.log("Анимация hideCourses завершена"),
        });
    };

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

    console.log("Добавление обработчиков событий...");
    mobileBackButton.addEventListener("click", (e) => {
        console.log("Клик по mobileBackButton", e);
        hideCourses();
    });

    viewCourseButton.addEventListener("click", (e) => {
        console.log("Клик по viewCourseButton", e);
        showCourses();
    });

    console.log("Инициализация начального состояния...");
    gsap.set(mobileCourses, { clearProps: "transform" });
    gsap.set(mobileCourses, {
        x: "300%",
        onComplete: () => console.log("Начальное состояние установлено"),
    });

    console.log("Инициализация завершена успешно");
};

console.log("Запуск инициализации мобильной навигации...");
document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM полностью загружен");
    initMobileCoursesNavigation();
    initBurgerMenu();
});

const initBurgerMenu = () => {
    const burgerPc = document.querySelector("#burger-pc");
    const burgerIconPc = burgerPc?.querySelector(".burger");
    const coursesBlock = document.querySelector(".header__courses");
    let isCoursesVisible = false;

    const burgerMobile = document.querySelector("#burger-mobile");
    const burgerIconMobile = burgerMobile?.querySelector(".burger");
    const burgerTextMobile = burgerMobile?.querySelector(".header__burger-text");
    const mobileContent = document.querySelector(".header__mobile-content");
    const headerMobile = document.querySelector(".header__mobile");

    let isMobileContentVisible = false;

    const hamburgerInput = document.querySelector('.hamburger input[type="checkbox"]');
    const blurBackground = document.getElementById("background-blur");

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

    burgerPc?.addEventListener("click", (e) => {
        e.stopPropagation();
        burgerIconPc?.classList.toggle("active");
        blurBackground?.classList.toggle("active");
        animateCourses();
    });

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

    document.addEventListener("click", (e) => {
        const target = e.target;

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

    document.addEventListener("click", (e) => {
        const target = e.target;

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
    const header = document.querySelector("header");
    if (!header) return;

    const throttle = (fn, delay) => {
        let lastCall = 0;
        return (...args) => {
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