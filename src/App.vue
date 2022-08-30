<template>
   <div class="content-part top-content-part">
      <div class="side-description-bar left">
            <div>QUEUE</div>
      </div>
      <DrinkContainer :isQueue="true" :ordersInQueue="queueState" :displayedDrinkCount="12"></DrinkContainer>
      <div class="side-description-bar right">
            <div>QUEUE</div>
      </div>
   </div>
   <div class="content-part middle-content-part">
      <div class="side-description-bar left">
            <div>IN PROGRESS</div>
      </div>
      <div class="progress-content-container">
            <ProgressDrinkComponent :order="drinksInProgress[0]" :drink-types="drinkTypes"/> <!-- change flex to center (from space-between) if only one iiwa is used-->
            <ProgressDrinkComponent :order="drinksInProgress[1]" :drink-types="drinkTypes"/>
      </div>
      
      <div class="side-description-bar right">
            <div>IN PROGRESS</div>
      </div>
   </div>
   <div class="content-part bottom-content-part">
      <div class="side-description-bar left">
            <div>READY</div>
      </div>
      <DrinkContainer :pickUpDrinks="pickUpOrdersState" :displayedDrinkCount="12"></DrinkContainer>
      <div class="side-description-bar right">
            <div>READY</div>
      </div>
   </div>
</template>

<script>
import DrinkContainer from './components/DrinkContainer.vue';
import ProgressDrinkComponent from './components/ProgressDrinkComponent.vue';
import RobobarDate from '@/scripts/robobar-date.js';
import * as apicomm from '@/scripts/api-communication.js';

export default {
   name: 'App',
   components: {
      DrinkContainer,
      ProgressDrinkComponent
   },
   data() {
      return {
         timeDeltaInMilliseconds: 420,  // stands for time difference between PLC's current time and (frontend) PC's current time
         queueState: undefined,
         pickUpOrdersState: undefined,
         drinkTypes: undefined,
         drinksInProgress: [undefined, undefined],
      }
   },
   async created() {
      let plcTimeString = await apicomm.getCurrentPlcTimeFromApi();
      let plcTime = new RobobarDate(plcTimeString);
      let pcTime = new Date();

      let drinkTypes = await apicomm.getDrinkTypesFromApi();
      this.drinkTypes = drinkTypes["drinkTypes"];

      this.timeDeltaInMilliseconds = pcTime - plcTime;


      let pickUpOrdersState = await apicomm.getPickUpDrinksStateFromApi();
      this.pickUpOrdersState = pickUpOrdersState["pickUpDrinks"];

      this.startPeriodicQueueStateUpdates();
      this.startPeriodicProgressDrinkUpdates();
      this.startPeriodicPickUpDrinksStateUpdates();
   },
   methods: {
      async startPeriodicProgressDrinkUpdates() {
         const sides = [0, 1];

         sides.forEach(async (side) => {
            let drinkInProgress = await apicomm.getDrinkInProgressFromApi(side);
            drinkInProgress = drinkInProgress["drinkInProgress"];
            drinkInProgress["prepStartedAt"] = new RobobarDate(new RobobarDate(drinkInProgress["prepStartedAt"]).getTime() + this.timeDeltaInMilliseconds);
            drinkInProgress["prepDoneAt"] = new RobobarDate(new RobobarDate(drinkInProgress["prepDoneAt"]).getTime() + this.timeDeltaInMilliseconds);
            
            if (this.drinksInProgress[side] === undefined 
               || this.drinksInProgress[side]["drinkOrderId"] !== drinkInProgress["drinkOrderId"] 
               || this.drinksInProgress[side]["prepDoneAt"] !== drinkInProgress["prepDoneAt"]) {
               this.drinksInProgress[side] = drinkInProgress;
            }
         })
         
         setTimeout(()=>{this.startPeriodicProgressDrinkUpdates();}, 500);
      },
      async startPeriodicQueueStateUpdates() {
         let queueState = await apicomm.getQueueStateFromApi();
         queueState = queueState["queueDrinks"];
         this.queueState = queueState;
         
         setTimeout(()=>{this.startPeriodicQueueStateUpdates();}, 500);
      },
      async startPeriodicPickUpDrinksStateUpdates() {
         let pickUpOrdersState = await apicomm.getPickUpDrinksStateFromApi();
         pickUpOrdersState = pickUpOrdersState["pickUpDrinks"];
         this.pickUpOrdersState = pickUpOrdersState;
         
         setTimeout(()=>{this.startPeriodicPickUpDrinksStateUpdates();}, 500);
      },
   }
}
</script>

<style lang="scss">
@import 'src/variables.scss';
@import url('https://fonts.googleapis.com/css2?family=Inter&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@900&display=swap');

html, body {
   margin: 0;
   width: 100%;
   height: 100%;
   background-color: $background-color;
   font-family: 'Inter', sans-serif;
}

#app.content {
   display: flex;
   flex-flow: column nowrap;
   justify-content: flex-start;
   align-items: stretch;
   height: 100%;
   width: 100%;

   .content-part {
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-between;
      align-items: center;
      height: 100%;
      width: 100%;
   }

   .side-description-bar {
      height: 100%;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-basis: $side-desc-bar-width-perc;
      div {
         writing-mode: vertical-lr;
         transform: rotate(180deg);
         font-size: 4vh;
         font-weight: 900;
      }
   }

   .top-content-part {
      flex-basis: calc((100% - #{$middle-content-part-height}) / 2);

      .side-description-bar {
         background-color: $in-queue-color;
      }

      svg {
         fill: $in-queue-color;
      }
   }

   .middle-content-part {
      flex-basis: $middle-content-part-height;

      .side-description-bar {
         background-color: $progress-color;
      }

      .progress-content-container {
         display: flex;
         flex-flow: row wrap;
         flex-basis: calc(#{$middle-content-part-width} - 22.5%);
         justify-content: space-between;
      }
   }

   .bottom-content-part {
      flex-basis: calc((100% - #{$middle-content-part-height}) / 2);

      .side-description-bar {
         background-color: $drink-ready-color;
      }

      svg {
         fill: $drink-ready-color;
      }
   }
}

svg {
   text {
      fill: $frontcolor;
      font-family: 'Inter', sans-serif;
      font-weight: 900;
   }
}
</style>
