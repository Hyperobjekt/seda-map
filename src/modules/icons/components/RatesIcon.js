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

export default function RatesIcon({ color, ...props }) {
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
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.76999 16.9607H8.29081V19.24H3.76999V16.9607ZM8.29081 13.5605H12.8116V15.8398H8.29081V13.5605ZM12.8116 10.1602H17.3324V12.4395H12.8116V10.1602ZM17.3324 6.76001H22.23V9.03929H17.3324V6.76001Z"
        fill={color ? color : "url(#paint0_linear)"}
      />
      <defs>
        <linearGradient
          id="paint0_linear"
          x1="3.76999"
          y1="16.1821"
          x2="28.6805"
          y2="-2.70928"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#0032A3" />
          <stop offset="0.559755" stopColor="#179BFF" />
          <stop offset="1" stopColor="#169CF7" />
        </linearGradient>
      </defs>
    </svg>
  )
}
