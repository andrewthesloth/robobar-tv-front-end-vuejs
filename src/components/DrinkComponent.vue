<template>
<div class="drink">
    <div class="drink-icon">
        <svg width="100%" height="100%" viewBox="0 0 500 440" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
            <g transform="matrix(1,0,0,1,-162.929,-116.148)">
                <path d="M240.106,125.594L219.525,125.594L315.567,546.702L509.763,546.702L606.332,125.594L585.752,125.594L496.011,524.93L330.665,524.93L240.106,125.594"/>
            </g>
        </svg>
    </div>
    <div class="drink-label">
        <div>{{ orderId }}</div>
    </div>
</div>
</template>

<script>
export default {
  name: 'DrinkComponent',
  props: {
    orderId: {
      type: Number,
      default: 100
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import 'src/variables.scss';
.drink {
    margin: auto;
    width: $queue-glass-width;
    height: 25vh;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;

    .drink-label {
      width: 100%;
      height: 20%;
      display: flex;

      div {
          margin: auto;
          font-size: 3vh;
          font-weight: 900;
          color: $frontcolor;
      }
    }
    .drink-icon {
      width: 100%;
      height: 70%;
    }
}
</style>
