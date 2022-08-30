<template>
  <div class="drink-container">
    <template v-bind:key="n" v-for="n in displayedDrinkCount">
      <template v-if="isQueue">
        <DrinkComponent :style="{visibility: iteratorExceedsArrayLength(n - 1) ?  'hidden' : 'visible'}" :orderId="getQueueOrderId(n - 1)"></DrinkComponent>
      </template>
      <template v-else>
          <DrinkComponent :style="{visibility: !((n - 1) in pickUpDrinks) ?  'hidden' : 'visible'}" :orderId="getPickUpDrinkOrderId(n - 1)"></DrinkComponent>
      </template>
    </template>
  </div>
</template>

<script>
import DrinkComponent from './DrinkComponent.vue';

export default {
  name: 'DrinkContainer',
  props: {
    isQueue: {
      type: Boolean,
      default: false,
    },
    displayedDrinkCount: {
        type: Number,
        default: 6,
    },
    ordersInQueue: {
      type: Array,
      default: () => {return Array();}
    },
    pickUpDrinks: {
      type: Object,
      default: () => {return Object();}
    }
  },
  components: {
    DrinkComponent,
  },
  methods: {
    iteratorExceedsArrayLength(iterValue) {
      if (Array.isArray(this.ordersInQueue)) {
        return iterValue >= this.ordersInQueue.length;
      } else {
        return true;
      }
    },
    getQueueOrderId(iterValue) {
      if (Array.isArray(this.ordersInQueue)) {
        if (this.iteratorExceedsArrayLength(iterValue)) {
          return null;
        }
        const iterOrder = this.ordersInQueue[iterValue];

        if ("drinkOrderId" in iterOrder) {
          return iterOrder.drinkOrderId;
        } else {
          return null;
        }
      } else {
        return "Not Arr";
      }
    },
    getPickUpDrinkOrderId(iterValue) {
      if (typeof(this.pickUpDrinks) === "object") {
        if ((iterValue) in this.pickUpDrinks) {
          if ("drinkOrderId" in this.pickUpDrinks[iterValue]) {
            return this.pickUpDrinks[iterValue].drinkOrderId;
          }
        } else {
          return null;
        }
      } else {
        return "Not Obj";
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import 'src/variables.scss';
.drink-container {
    height: 100%;
    flex-basis: $middle-content-part-width;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-evenly;
    align-items: center;
}
</style>
