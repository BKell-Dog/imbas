---
layout: article.njk
title: The Dream Timer
image: "pcb.webp"
imageTransform: "translateY(-50px)"
---

### The Dream Timer

We were hired by a woman making a suite of electronic devices to *help new mothers* better manage their babies. She wanted a device that would be both a clock at night and a timer during the day, so that a mother could keep track of when her baby was sleeping. In the day she could time naps, and at night she could see the time. Our task was to *make the product* from scratch.

The most crucial first step of building a complete product is listening to the client diligently, and recording all system requirements. Too often contractors fulfill the requirements to find out that the *client wanted something else* which was never explained. We want to avoid that scenario at all costs, so we and the client rigorously defined the system's behavior from the beginning and reevaluated things once a prototype was done.

{% woodcut "pcb.webp", "scale(0.8) translateY(-100px)" %}

The prototype was a breadboard built with an ESP32 as microcontroller, connected to a series of LEDs and switches. We built it, programmed it, tested it, and had it in the client's hands within three days. With a proof of concept done, we moved on to designing the PCB and the plastic housing. We also switched to *cheaper and smaller components*, like swapping the ESP32 microcontroller for the easier [CH32V003](https://wch-ic.com/products/CH32V003.html) RISC-V controller from WCH, and replacing the ESP32's wifi card with an [ESP8684-WROOM-02C](https://documentation.espressif.com/esp8684-wroom-02c_datasheet_en.pdf) (also made by [Espressif](https://www.espressif.com)).

Once our client was happy with the prototype, we had a sample made in the factory, and tested it once again: this time the PCB, all the ancillary components, and the enclosure for quality control. It took some arguing with the factory and suppliers, but we got our production model *within tolerance* on the enclosure and *behaving properly* in the electronics within a month.

The client was happy, and our product became one in a line of small household devices that *help make life easier* for young mothers.

## We Can Do Similar Work For You

{% include "components/contact.njk" %}