<template>
<Transition name="slide-fade" mode="out-in">
    <div v-if="show === 0" class="prep-drink-container">
        <div class="progress-animation-container">
            <div class="drink">
                <div class="drink-icon">
                    <div class="drink-content" :style="{'height': `${progressInPercentage * 85 + 5}%`}"></div>
                    <svg width="100%" height="100%" viewBox="0 0 500 440" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
                        <g transform="matrix(1,0,0,1,-162.929,-116.148)">
                            <g transform="matrix(1,0,0,1,162.929,116.148)">
                                <path class="drink-bg" d="M66.957,9.446L0,9.446L0,440L500,440L500,9.446L433.043,9.446L339.393,418.716L159.446,421.038L66.957,9.446Z"/>
                            </g>
                            <path d="M240.106,125.594L219.525,125.594L315.567,546.702L509.763,546.702L606.332,125.594L585.752,125.594L496.011,524.93L330.665,524.93L240.106,125.594"/>
                        </g>
                    </svg>
                </div>
                <svg class="drink-label" viewBox="0 0 60 18">
                    <text class="drink-label-text" x="50%" y="50%" dominant-baseline="middle" text-anchor="middle">{{ typeof(order) === "undefined" ? "###" : order.drinkOrderId }}</text>
                </svg>
            </div>
            <svg class="gauge" viewBox="0 0 100 100" xml:space="preserve">
                <path class="gauge-curve-prefill" d="M 50 3A 47 47 0 1 1 49.9704690309993 3.0000092774278357"></path>
                <path class="gauge-curve" :d="gaugeCurve"/>
            </svg>
        </div>
        <div class="prep-info-container">
            <svg  viewBox="0 0 100 20">
                <text class="prep-info-header" dominant-baseline="middle" text-anchor="start" x="0%" y="50%">{{ typeof(currentDrinkType) === "undefined" ? "No drink" : currentDrinkType.name }}</text>
            </svg>
            <svg  viewBox="0 0 180 20">
                <text dominant-baseline="middle" x="0%" y="50%">Time elapsed:</text>
                <text class="elapsed-time" dominant-baseline="middle" text-anchor="end" x="100%" y="50%">{{ Math.floor(timeInSeconds) }} s</text>
            </svg>
        </div>
    </div>
    
    <img v-else-if="show === 1" src="@/assets/czech_institute_of_informatics_robotics_and_cybernetics_negativ.svg" alt="logo">
    <img v-else-if="show === 2" src="@/assets/RGB_RICAIP_WHITE_cropped.svg" alt="logo">
    <img v-else-if="show === 3" src="@/assets/pilsner_slideshow.svg" alt="logo">
    <img v-else-if="show === 4" src="@/assets/homeconnect_slideshow.svg" alt="logo">
    <img v-else-if="show === 5" src="@/assets/attention_sign.svg" alt="logo">
    <img v-else-if="show === 6" src="@/assets/dishes_slideshow.svg" alt="logo">
</Transition>
</template>

<script>
// import RobobarDate from '@/scripts/robobar-date';
import * as pr from '@/scripts/progress-render';

export default {
  name: 'ProgressDrinkComponent',
  props: {
    order: {
        type: Object,
        default: undefined,
    },
    drinkTypes: {
        type: Array,
        default: undefined,
    },
    strokeWidth: {
        type: Number,
        default: 6,
    }
  },
  data() {
      return {
          timeInSeconds: 0,
          show: 0,
          currentDrinkType: undefined,
          currentAnimationId: undefined,
          svgSize: 100,
          gaugeRadius: undefined,
          gaugeCurve: "",
          progressInPercentage: 1,
      }
  },
  methods: {
        setCurrentDrinkType(order, drinkTypes) {
            this.currentDrinkType = undefined;

            for (const drinkType of drinkTypes) {
                if (drinkType.id === order.drinkTypeId) {
                    this.currentDrinkType = drinkType;
                    break;
                }
            }
        },
        calcTimeInSeconds() {
            this.timeInSeconds = this.time;
        },
        startAnimation() {
            this.setTimeInSeconds();
            if (this.timeInSeconds >= this.currentDrinkType.prepTimeInSeconds) {
                return -1;
            }

            let audio = new Audio(require('@/assets/sounds/iphone_mess.mp3'));
            audio.play();

            this.endAnimationWithoutSound();
            this.currentAnimationId = setInterval(() => {
                this.setTimeInSeconds();
                this.renderGauge();
                console.log('Redraw done.');

                if (this.timeInSeconds >= this.currentDrinkType.prepTimeInSeconds) {
                    this.endAnimationWithoutSound();
                }
            }, 1);
        },
        setTimeInSeconds() {
            this.timeInSeconds = Math.min(this.currentDrinkType.prepTimeInSeconds, (new Date() - this.order.prepStartedAt) / 1000);
        },
        renderGauge() {
            // debugger;
            this.progressInPercentage = this.timeInSeconds / this.currentDrinkType.prepTimeInSeconds;
            const perc = Math.max(0, Math.min(this.progressInPercentage, 0.9999));
            let pathStr = `M ${this.svgSize / 2} ${this.svgSize / 2 - this.gaugeRadius}\n`;
            const angleInDegrees = pr.getDegreesFromPerc(perc);
            const angleInRadians = pr.getRadiansFromDegrees(angleInDegrees);
            const coords = pr.getCoordsFromRadians(angleInRadians, this.gaugeRadius, this.svgSize);

            pathStr += pr.getOutterArcString(coords[0], coords[1], this.gaugeRadius, angleInRadians);

            this.gaugeCurve = pathStr;
        },
        endAnimationWithoutSound() {
            if (this.currentAnimationId !== undefined) {
                clearInterval(this.currentAnimationId);
                this.currentAnimationId = undefined;
            }
        },
        endAnimationWithSound() {
            if (this.currentAnimationId !== undefined) {
                let audio = new Audio(require('@/assets/sounds/iphone_noti.mp3'));
                audio.play();

                clearInterval(this.currentAnimationId);
                this.currentAnimationId = undefined;
            }
        }
  },
  watch: {
    order(newOrder, oldOrder) {
        // debugger;
        if (Array.isArray(this.drinkTypes)) {
            if (oldOrder === undefined || oldOrder.drinkOrderId !== newOrder.drinkOrderId) {
                this.setCurrentDrinkType(newOrder, this.drinkTypes);
                this.startAnimation();
            }
        }
    },
    drinkTypes(newDrinkTypes) {
        if (Array.isArray(newDrinkTypes) && typeof(this.order) !== "undefined") {
            this.setCurrentDrinkType(this.order, newDrinkTypes);
        }
    },
  },
  created() {
    if (typeof(this.gaugeRadius) === 'undefined') {
        this.gaugeRadius = (this.svgSize - this.strokeWidth) / 2; 
    }
    
    window.setInterval(() => {
        if (typeof(this.currentAnimationId) === "undefined" || (this.order["prepDoneAt"].getFullYear() > 2020 && this.order["prepDoneAt"].getFullYear() < 2080)) {
            this.endAnimationWithSound();
            this.show++;

            if (this.show > 6) {
                this.show = 1;
            }
        } else {
            this.show = 0;
        }
    }, 4000);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import 'src/variables.scss';
.slide-fade-enter-active {
  transition: all 1s ease-out;
}

.slide-fade-leave-active {
  transition: all 1s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from {
    transform: translateY(-300px);
    opacity: 0;    
}
.slide-fade-leave-to {
  transform: translateY(300px);
  opacity: 0;
}

img {
    max-width: 50vh;
    flex-basis: 35%;
    height: 100%;
}
.prep-drink-container {
    max-width: 70vh;
    flex-basis: 35%;
    height: 100%;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-evenly;
    gap: 1vw;
    .progress-animation-container {
        height: 100%;
        // width: 50vh;
        flex-basis: 50%;
        display: grid;

        svg {
            fill: $progress-color;
        }
        .gauge-curve {
            stroke: $progress-color;
            stroke-width: 6;
            stroke-linecap: round;
            fill: none;
        }
        .gauge-curve-prefill {
            @extend .gauge-curve;
            stroke: white;
        }

        path.drink-bg {
            fill: $background-color;
        }

        svg, .drink, .drink-content {
            grid-column: 1;
            grid-row: 1;
        }

        .drink {
            margin: auto;
            width: 60%;
            height: 70%;
            display: flex;
            flex-flow: column nowrap;
            justify-content: space-between;
            align-items: center;

            .drink-label {
                width: 100%;
                flex-basis: 30%;
                display: flex;

                div {
                margin: auto;
                font-size: 4vh;
                font-weight: 900;
                color: $frontcolor;
                }
            }
            .drink-icon {
                display: grid;
                width: 100%;
                flex-basis: 70%;
                justify-content: center;
                align-items: end;
                align-content: center;
                .drink-content {
                background-color: $progress-color;
                width: 100%;
                max-height: 90%;
                min-height: 7%;
                // height: 100%;
                }
            }
        }

        .gauge {
            margin: auto;
        }
    }
    .prep-info-container {
        display: flex;
        flex-flow: column nowrap;
        justify-content: center;
        flex-basis: 50%;
        // align-items: center;
        .prep-info-content {
            font-size: 3vh;
            font-weight: 900;
            color: $frontcolor;
            
            .elapsed-time-container {
                display: flex;
                flex-flow: row nowrap;

                .elapsed-time {
                width: 6ch;
                text-align: right;
                }
            }
        }
    }
}
</style>
