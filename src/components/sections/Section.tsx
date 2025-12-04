"use client";
import { forwardRef, type PropsWithChildren } from "react";
import clsx from "clsx";

type Props = PropsWithChildren<{
  id?: string;
  className?: string;
}>;

const Section = forwardRef<HTMLElement, Props>(({ id, className, children }, ref) => (
  <section ref={ref} id={id} className={clsx("relative w-full h-screen flex items-center justify-center", className)}>
    {children}
  </section>
));

Section.displayName = "Section";
export default Section;
