import styledComponents from "styled-components";

const StyledSVG = styledComponents.svg`
stroke: var(--bs-body-color);
stroke-width: 5;
fill: var(--bs-light-primary);
max-height: 100%;
.tick{
     stroke-dasharray: 33;
}
.line1{
     stroke-dasharray: 35;
}
.line2{
     stroke-dasharray: 22;
}
.line3{
     stroke-dasharray: 44;
}
@keyframes tick1 {
  0%, 8.57143%, 100% {
    stroke-dashoffset: 33;
  }
  12.8571%, 99% {
    stroke-dashoffset: 0;
  }
}
@keyframes line11 {
  0%, 14.2857%, 100%{
    stroke-dashoffset: 35;
  }
  17.1429%, 99% {
    stroke-dashoffset: 0;
  }
}
@keyframes line12 {
  0%, 20%, 100% {
    stroke-dashoffset: 22;
  }
  24.2857%, 99% {
    stroke-dashoffset: 0;
  }
}
@keyframes line13 {
  0%, 27.2857%, 100% {
    stroke-dashoffset: 44;
  }
  31.8571%, 99% {
    stroke-dashoffset: 0;
  }
}



@keyframes tick2 {
  0%, 40%, 100% {
    stroke-dashoffset: 33;
  }
  42.8571%, 99% {
    stroke-dashoffset: 0;
  }
}
@keyframes line21 {
  0%, 44.2857%, 100%{
    stroke-dashoffset: 35;
  }
  48.4286%, 99% {
    stroke-dashoffset: 0;
  }
}
@keyframes line22 {
  0%, 51.4286%, 100% {
    stroke-dashoffset: 22;
  }
  54.1429%, 99% {
    stroke-dashoffset: 0;
  }
}
@keyframes line23 {
  0%, 55.7143%, 100% {
    stroke-dashoffset: 44;
  }
  61.4286%, 99% {
    stroke-dashoffset: 0;
  }
}

@keyframes tick3 {
  0%, 70%, 100% {
    stroke-dashoffset: 33;
  }
  72.8571%, 99% {
    stroke-dashoffset: 0;
  }
}
@keyframes line31 {
  0%, 74.2857%, 100%{
    stroke-dashoffset: 35;
  }
  78.7143%, 99% {
    stroke-dashoffset: 0;
  }
}
@keyframes line32 {
  0%, 82.8571%, 100% {
    stroke-dashoffset: 22;
  }
  85.8571%, 99% {
    stroke-dashoffset: 0;
  }
}
@keyframes line33 {
  0%, 88.5714%, 100% {
    stroke-dashoffset: 44;
  }
  92.8571%, 99% {
    stroke-dashoffset: 0;
  }
}
@keyframes pencil {
  0%, 75%, 100% {
    stroke-dashoffset: 44;
  }
  79.5%, 99% {
    stroke-dashoffset: 0;
  }
}


.group1 {
    .tick{
        animation: tick1 7s linear infinite normal forwards;
    }.line1{
        animation: 7s linear infinite line11;
    }.line2{
        animation: 7s linear infinite line12;
    }.line3{
        animation: 7s linear infinite line13;
    }
}

.group2 {
    .tick{
        animation: 7s linear infinite tick2;
    }.line1{
        animation: 7s linear infinite line21;
    }.line2{
        animation: 7s linear infinite line22;
    }.line3{
        animation: 7s linear infinite line23;
    }
}

.group3 {
    .tick{
        animation: 7s linear infinite tick3;
    }.line1{
        animation: 7s linear infinite line31;
    }.line2{
        animation: 7s linear infinite line32;
    }.line3{
        animation: 7s linear infinite line33;
    }
}
@keyframes pencil{
0% {
    offset-distance: 0%;
}
8.57143% {
    offset-distance: 8.896336%;
}
11.4286% {
    offset-distance: 10.168423%;
}
12.8571% {
    offset-distance: 12.235789%;
}
14.2857% {
    offset-distance: 13.695322%;
}
17.1429% {
    offset-distance: 17.285251%;
}
20% {
    offset-distance: 21.011177%;
}
24.2857% {
    offset-distance: 23.30773%;
}
27.2857% {
    offset-distance: 25.872995%;
}
31.8571% {
    offset-distance: 30.963899%;
}
40% {
    offset-distance: 39.420456%;
}
41.4286% {
    offset-distance: 40.749824%;
}
42.8571% {
    offset-distance: 42.843619%;
}
44.2857% {
    offset-distance: 44.303152%;
}
48.4286% {
    offset-distance: 47.773227%;
}
51.4286% {
    offset-distance: 51.401336%;
}
54.1429% {
    offset-distance: 53.697258%;
}
55.7143% {
    offset-distance: 56.147332%;
}
61.4286% {
    offset-distance: 60.739175%;
}
70% {
    offset-distance: 68.794968%;
}
71.4286% {
    offset-distance: 70.135349%;
}
72.8571% {
    offset-distance: 72.229144%;
}
74.2857% {
    offset-distance: 73.58309%;
}
78.7143% {
    offset-distance: 77.341036%;
}
82.8571% {
    offset-distance: 81.146532%;
}
85.8571% {
    offset-distance: 83.442453%;
}
88.5714% {
    offset-distance: 85.892529%;
}
92.8571% {
    offset-distance: 90.382963%;
}
100% {
    offset-distance: 100%;
}
}
@keyframes rotate-pencil{
  0% {
    transform: rotate(167deg);
}
8.57143% {
    transform: rotate(133deg);
}

31.4286% {
    transform: rotate(133deg);
}
37.1429% {
    transform: rotate(117deg);
}
40% {
    transform: rotate(133deg);
}
61.4286% {
    transform: rotate(133deg);
}
67.1429% {
    transform: rotate(117deg);
}
70% {
    transform: rotate(133deg);
}
92.8571% {
    transform: rotate(133deg);
}
100% {
    transform: rotate(167deg);
}
}
.pencil{
  fill: var(--bs-primary);
  animation: pencil 7s linear infinite normal forwards;
  offset-path: path('M209.002889,258L225.773674,175.429261L231.742769,185.894476L243.176856,170.000001L257,170L291,170L256.471851,177.283667L278.216387,177.79357L255.534377,186.499679L303.745099,185.810299L225.773674,204.116368L231.742769,215.201818L243.176856,199.000006L257,199.000006L289.864878,199.000006L256.471843,207.100912L278.21638,207.100912L256.471851,215.201818L299.960924,215.201818L225.77,233L231.742769,244.201818L243.176856,228.000006L256,228.000006L291.591274,228.000006L256.471846,236.100912L278.21638,236.100912L256.471843,244.201818L299,244L209,258');
  offset-rotate: 0deg;
  .inner-g{
    animation: rotate-pencil 7s linear infinite normal forwards;
    transform: rotate(167deg);
}
}
  }
}

`;

const OrderSvg = ({ stroke = "var(--bs-primary)", strokeWidth = 4 }) => {
  return (
    <StyledSVG
      id="eSRQwj4IZst1"
      viewBox="0 0 273 268"
      shapeRendering="geometricPrecision"
      textRendering="geometricPrecision"
    >
      <g transform="translate(-130.202398-56.622217)">
        <g>
          <path d="M311.025857,240h8.384009c-1.25741-38.18471,6.840894-95.215726-19.448949-96.741872q-38.587981.665563-85.351168,0c-9.888689,4.687501-8.819367,14.493861-.000001,19.61272" />
          <path
            d="M299.960917,161.258128c-4.464111-4.516617-3.849882-13.516618,0-18"
            transform="matrix(1.029289 0 0 1-8.785555-.018121)"
          />
          <path
            d="M214.609748,162.870847c40.12385-.368819,95.76911-4.067341,90.890072-.229172c5.16947-1.092969,3.832589,53.561252,5.526037,93.176409l-96.416109,1.705454v-94.652691Z"
            transform="translate(0 0.229173)"
          />
        </g>
        <g transform="translate(0 58.307343)" className="group3">
          <path
            className="tick"
            d="M225.773672,174.809025l5.969089,11.08545l11.938175-16.201812"
            transform="translate(.000002 0)"
            strokeDashoffset="32.71544"
            strokeDasharray="32.71544"
          />
          <path
            className="line1"
            d="M256.471843,174.809025h34.961804"
            transform="translate(0-4.809025)"
            strokeDashoffset="34.961804"
            strokeDasharray="34.961804"
          />
          <path
            className="line3"
            d="M256.471843,185.894475h43.489074"
            strokeDashoffset="43.489074"
            strokeDasharray="43.489074"
          />
          <path
            className="line2"
            d="M256.471843,177.793569h21.744537"
            transform="translate(.000001 0)"
            strokeDashoffset="21.744537"
            strokeDasharray="21.744537"
          />
        </g>
        <g transform="translate(0 29.307343)" className="group2">
          <path
            className="tick"
            d="M225.773672,174.809025l5.969089,11.08545l11.938175-16.201812"
            transform="translate(.000002 0)"
            strokeDashoffset="32.71544"
            strokeDasharray="32.71544"
          />
          <path
            className="line1"
            d="M256.471843,174.809025h34.961804"
            transform="translate(0-4.809025)"
            strokeDashoffset="34.961804"
            strokeDasharray="34.961804"
          />
          <path
            className="line3"
            d="M256.471843,185.894475h43.489074"
            strokeDashoffset="43.489074"
            strokeDasharray="43.489074"
          />
          <path
            className="line2"
            d="M256.471843,177.793569h21.744537"
            transform="translate(.000001 0)"
            strokeDashoffset="21.744537"
            strokeDasharray="21.744537"
          />
        </g>
        <g transform="translate(0 0.000001)" className="group1">
          <path
            className="tick"
            d="M225.773672,174.809025l5.969089,11.08545l11.938175-16.201812"
            transform="translate(.000002 0)"
            strokeDashoffset="32.71544"
            strokeDasharray="32,72"
          />
          <path
            className="line1"
            d="M256.471843,174.809025h34.961804"
            transform="translate(0-4.809025)"
            strokeDashoffset="34.961804"
            strokeDasharray="34.961804"
          />
          <path
            className="line2"
            d="M256.471843,177.793569h21.744537"
            transform="translate(.000001 0)"
            strokeDashoffset="21.744537"
            strokeDasharray="21.744537"
          />
          <path
            className="line3"
            d="M256.471843,185.894475h43.489074"
            strokeDashoffset="43.489074"
            strokeDasharray="43.489074"
          />
        </g>
        <g id="eIrJkXDzQt323_to" className="pencil">
          <g id="eIrJkXDzQt323_tr" transform="rotate(167)" className="inner-g">
            <g transform="scale(0.893818,1) translate(-337.887665,-323.259903)">
              <path
                d="M202.750045,314.656244h117.249955l-.000001,15.349086h-117.249954v-15.349086Z"
                transform="translate(.000002 0)"
              />
              <path d="M336.628176,323.183514L320,314.656244v15.349086l16.628176-6.821816Z" />
              <path d="M196.780956,314.656244h5.969091v15.349086h-5.969091c-5.376478-4.249999-7.119011-11.924542,0-15.349086Z" />
              <path
                d="M212.130041,314.656244v15.349086h7.674541v-15.349086"
                transform="translate(.000002 0)"
              />
              <path
                d="M336.628176,322.330787h-8.314088"
                transform="translate(0 0.669213)"
              />
            </g>
          </g>
        </g>
      </g>
    </StyledSVG>
  );
};
export default OrderSvg;
