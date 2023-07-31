gsap.registerPlugin(ScrollTrigger);

  // TEXT STAGGER ON SCROLL
window.addEventListener("DOMContentLoaded", (event) => {
  // Split text into spans
  let typeSplit = new SplitType("[gsap-textscroll-split]", {
    types: "lines, words, chars",
    tagName: "span"
  });

  // Link timelines to scroll position
  function createScrollTrigger(triggerElement, timeline) {
    // Reset tl when scroll out of view past bottom of screen
    ScrollTrigger.create({
      trigger: triggerElement,
      start: "top bottom",
      onLeaveBack: () => {
        timeline.progress(0);
        timeline.pause();
      }
    });
    // Play tl when scrolled into view (60% from top of screen)
    ScrollTrigger.create({
      trigger: triggerElement,
      start: "top 75%",
      onEnter: () => timeline.play()
    });
  }

  // Paragraph: Letters from bottom
document.querySelectorAll('[gsap-textscroll-heading]').forEach((element) => {
    let tl = gsap.timeline({ paused: true });
    tl.from(element.querySelectorAll('.char'), {
        opacity: 0,
        yPercent: 50,
        duration: 0.6,
        ease: "power4.out",
        stagger: { amount: 0.2 }
    });
    createScrollTrigger(element, tl);
});

  // Avoid flash of unstyled content
  gsap.set("[gsap-textscroll-split]", { opacity: 1 });

  // FOOTER BORDER RADIUS TRANSFORM
  gsap.to(".footer-radius_item", {
    borderRadius: "0%",
    scrollTrigger: {
      trigger: ".footer-radius_item",
      start: "top 95%",
      end: "top top",
      scrub: true,
    }
  });

// HEADER OPACITY TRANSFORMATION
gsap.to(".header-100vh", {
  opacity: 0,
  scrollTrigger: {
    trigger: ".header-trigger",
    start: "top top",
    end: "bottom center",
    scrub: true,
  }
});

// FEATURED LOCATIONS SPIRAL TEXT
// Definieer de combo klassen
const classes = Array.from({ length: 8 }, (_, i) => `.is-0${i + 1}`);

classes.forEach((cls) => {
  // Definieer de in-animatie voor deze klasse
  const animIn = gsap.timeline({
    paused: true,
    defaults: { duration: 0.6, ease: "expo.inOut" }
  }).to(`.sticky-spiral_location-text${cls}`, { opacity: 1, y: '0rem' });

  // Definieer de uit-animatie voor deze klasse
  const animOut = gsap.timeline({
    paused: true,
    defaults: { duration: 0.6, ease: "expo.inOut" }
  }).to(`.sticky-spiral_location-text${cls}`, { opacity: 0, y: '-24rem' });

  // Maak een ScrollTrigger voor deze klasse
  ScrollTrigger.create({
    trigger: `.sticky-spiral_text-trigger${cls}`,
    start: "top center", // triggeren wanneer de top van het element het midden van de viewport bereikt
    end: "bottom center", // blijven triggeren tot de onderkant van het element het midden van de viewport bereikt
    onEnter: () => animIn.restart(),
    onLeave: () => animOut.restart(), // voer de uit-animatie uit wanneer de onderkant van het trigger-element het midden van de viewport verlaat
    onLeaveBack: () => animOut.restart(), // voer de uit-animatie uit wanneer de bovenkant van het trigger-element het midden van de viewport verlaat
    onEnterBack: () => animIn.restart() // start de in-animatie wanneer de bovenkant van het trigger-element het midden van de viewport weer bereikt bij het naar boven scrollen
  });
});

// SPIRAL & VIDEO ON SCROLL (DESKTOP)
// Controleer de schermgrootte
if (window.matchMedia("(min-width: 992px)").matches) {

  // STICKY SPIRAL IMAGE Y-TRANSFORM
  gsap.to(".sticky-spiral_item-image", {
    y: "-1120rem",
    scrollTrigger: {
      trigger: ".sticky-spiral_trigger",
      start: "top bottom",
      end: "bottom bottom",
      scrub: true,
    }
  });

  // STICKY SPIRAL ROTATION
  gsap.to(".sticky-spiral_rotation.is-initial", {
    rotationY: "-315",
    scrollTrigger: {
      trigger: ".sticky-spiral_trigger",
      start: "top bottom",
      end: "bottom bottom",
      scrub: true,
    }
  });

  // VIDEO REVEAL
  // Definieer de eerste animatie
  const videoAnim1 = gsap.fromTo('.video-thumbnail_mask', 
    {
      width: '0%',
      height: '25%',
      rotation: 90,
      borderRadius: '50%'
    }, 
    {
      width: '100%',
      height: '100%',
      rotation: 0,
      ease: "power1.inOut",
      scrollTrigger: {
        trigger: ".sticky-video_wrapper",
        start: "top 75%",
        end: "bottom bottom",
        scrub: true
      }
    }
  );

  // Definieer de tweede animatie
  const videoAnim2 = gsap.fromTo('.video-thumbnail_mask', 
    {
      borderRadius: '50%'
    }, 
    {
      borderRadius: '0%',
      ease: "power1.inOut",
      scrollTrigger: {
        trigger: ".sticky-video_wrapper",
        start: "center center", // start op de helft van de scroll duur
        end: "bottom bottom",
        scrub: true
      }
    }
  );

  // VIDEO PSUEDO PARALLAX
  const videoThumbnailAnim = gsap.fromTo('.video-thumbnail.is-masked', 
    {
      height: '100%'
    }, 
    {
      height: '50%',
      scrollTrigger: {
        trigger: ".sticky-video_wrapper",
        start: "bottom bottom",
        end: "bottom top",
        scrub: true
      }
    }
  );

  // HEADER HEIGHT TRANSFORMATION
  gsap.to(".header-100vh_content", {
    height: "6.5%",
    scrollTrigger: {
      trigger: ".header-trigger",
      start: "top bottom",
      end: "bottom top",
      scrub: true,
    }
  });
}



  // MARQUEE
  // attribute value checker
  function attr(defaultVal, attrVal) {
    const defaultValType = typeof defaultVal;
    if (typeof attrVal !== "string" || attrVal.trim() === "") return defaultVal;
    if (attrVal === "true" && defaultValType === "boolean") return true;
    if (attrVal === "false" && defaultValType === "boolean") return false;
    if (isNaN(attrVal) && defaultValType === "string") return attrVal;
    if (!isNaN(attrVal) && defaultValType === "number") return +attrVal;
    return defaultVal;
  }

  // marquee component
  $("[mrq='marquee']").each(function (index) {
    let componentEl = $(this),
      panelEl = componentEl.find("[mrq='list']"),
      // Pauses the animation on hover
      triggerHoverEl = componentEl.find("[mrq-pause='hover']"),
      // Pauses the animation on click
      triggerClickEl = componentEl.find("[mrq-pause='click']");
    // Determines the animation speed dynamically
    let speedSetting = attr(100, componentEl.attr("mrq-speed")),
      // Vertical Marquee
      verticalSetting = attr(false, componentEl.attr("mrq-vertical")),
      // Reverses the default animation direction
      reverseSetting = attr(false, componentEl.attr("mrq-reversed")),
      // Flips the direction on scroll
      scrollDirectionSetting = attr(false, componentEl.attr("mrq-scroll-flip")),
      // Accelerates the animation speed on scroll
      scrollScrubSetting = attr(false, componentEl.attr("mrq-scroll-scrub")),
      moveDistanceSetting = -100,
      timeScaleSetting = 1,
      pausedStateSetting = false;
    if (reverseSetting) moveDistanceSetting = 100;
    let marqueeTimeline = gsap.timeline({
      repeat: -1,
      onReverseComplete: () => marqueeTimeline.progress(1)
    });
    if (verticalSetting) {
      speedSetting = panelEl.first().height() / speedSetting;
      marqueeTimeline.fromTo(
        panelEl,
        { yPercent: 0 },
        { yPercent: moveDistanceSetting, ease: "none", duration: speedSetting }
      );
    } else {
      speedSetting = panelEl.first().width() / speedSetting;
      marqueeTimeline.fromTo(
        panelEl,
        { xPercent: 0 },
        { xPercent: moveDistanceSetting, ease: "none", duration: speedSetting }
      );
    }
    let scrubObject = { value: 1 };
    ScrollTrigger.create({
      trigger: "body",
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        if (!pausedStateSetting) {
          if (scrollDirectionSetting && timeScaleSetting !== self.direction) {
            timeScaleSetting = self.direction;
            marqueeTimeline.timeScale(self.direction);
          }
          if (scrollScrubSetting) {
            let v = self.getVelocity() * 0.006;
            v = gsap.utils.clamp(-60, 60, v);
            let scrubTimeline = gsap.timeline({
              onUpdate: () => marqueeTimeline.timeScale(scrubObject.value)
            });
            scrubTimeline.fromTo(
              scrubObject,
              { value: v },
              { value: timeScaleSetting, duration: 0.6 }
            );
          }
        }
      }
    });
    function pauseMarquee(isPausing) {
      pausedStateSetting = isPausing;
      let pauseObject = { value: 1 };
      let pauseTimeline = gsap.timeline({
        onUpdate: () => marqueeTimeline.timeScale(pauseObject.value)
      });
      if (isPausing) {
        pauseTimeline.fromTo(
          pauseObject,
          { value: timeScaleSetting },
          { value: 0, duration: 0.6 }
        );
        triggerClickEl.addClass("is-paused");
      } else {
        pauseTimeline.fromTo(
          pauseObject,
          { value: 0 },
          { value: timeScaleSetting, duration: 0.6 }
        );
        triggerClickEl.removeClass("is-paused");
      }
    }
    if (window.matchMedia("(pointer: fine)").matches) {
      triggerHoverEl.on("mouseenter", () => pauseMarquee(true));
      triggerHoverEl.on("mouseleave", () => pauseMarquee(false));
    }
    triggerClickEl.on("click", function () {
      !$(this).hasClass("is-paused") ? pauseMarquee(true) : pauseMarquee(false);
    });
  });
});
