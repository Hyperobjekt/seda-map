import React from "react"
import { makeStyles } from "@material-ui/core"
import clsx from "clsx"

const useStyles = makeStyles(theme => ({
  root: {
    width: "1em",
    height: "1em",
    fontSize: 24,
  },
}))

export default function TrendsIcon({ color, ...props }) {
  const classes = useStyles()
  return (
    <svg
      className={clsx("icon", classes.root)}
      viewBox="0 0 26 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M5.91394 16.722C5.40193 16.7932 4.92914 16.4359 4.85793 15.9238C4.78672 15.4118 5.14406 14.939 5.65608 14.8678C7.57401 14.6011 9.66083 13.7572 11.9125 12.3242C14.3789 10.7545 16.7153 9.82104 18.9255 9.53657C19.4382 9.47058 19.9074 9.83272 19.9733 10.3454C20.0393 10.8581 19.6772 11.3273 19.1645 11.3933C17.2503 11.6396 15.1667 12.4721 12.9176 13.9035C10.4536 15.4716 8.12046 16.4151 5.91394 16.722Z"
        fill={color ? color : "url(#paint0_linear)"}
      />
      <path
        d="M6.10514 13.0715C5.59899 13.1765 5.10353 12.8513 4.99851 12.3452C4.89349 11.839 5.21868 11.3436 5.72483 11.2385C7.57051 10.8556 9.66462 9.82321 11.9946 8.12939C14.5234 6.29108 16.8496 5.14543 18.9858 4.70456C19.4921 4.60008 19.9872 4.92579 20.0917 5.43206C20.1962 5.93833 19.8704 6.43344 19.3642 6.53793C17.5189 6.91875 15.4251 7.94993 13.0954 9.64357C10.5668 11.4817 8.24095 12.6283 6.10514 13.0715Z"
        fill={color ? color : "url(#paint1_linear)"}
      />
      <path
        d="M5.9939 20.2376C5.4788 20.2811 5.02593 19.8988 4.98238 19.3837C4.93884 18.8686 5.32111 18.4158 5.83621 18.3722C7.35638 18.2437 9.43707 17.5021 12.0458 16.1358C14.8772 14.6528 17.2438 13.9004 19.1751 13.9004C19.692 13.9004 20.1111 14.3195 20.1111 14.8364C20.1111 15.3533 19.692 15.7724 19.1751 15.7724C17.5983 15.7724 15.5016 16.439 12.9143 17.7941C10.1043 19.2658 7.80836 20.0842 5.9939 20.2376Z"
        fill={color ? color : "url(#paint2_linear)"}
      />
      <defs>
        <linearGradient
          id="paint0_linear"
          x1="2.3567"
          y1="14.2846"
          x2="32.7119"
          y2="2.52382"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#0032A3" />
          <stop offset="0.706572" stopColor="#179BFF" />
          <stop offset="1" stopColor="#169CF7" />
        </linearGradient>
        <linearGradient
          id="paint1_linear"
          x1="2.48659"
          y1="10.7239"
          x2="32.2874"
          y2="-2.75188"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#0032A3" />
          <stop offset="0.706572" stopColor="#179BFF" />
          <stop offset="1" stopColor="#169CF7" />
        </linearGradient>
        <linearGradient
          id="paint2_linear"
          x1="2.48684"
          y1="17.8585"
          x2="33.3492"
          y2="7.33171"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#0032A3" />
          <stop offset="0.706572" stopColor="#179BFF" />
          <stop offset="1" stopColor="#169CF7" />
        </linearGradient>
      </defs>
    </svg>
  )
}
