---
layout: article.njk
title: Medical Device Power Supply
image: "power-supply.png"
imageTransform: "translateY(-60px) skew(2deg)"
---

### Medical Device Power Supply

We partnered with a *pre-seed startup* to help build part of their medical device, and ended up *redefining the architecture* before we ever prototyped. They had a founding engineer who needed to focus on the delicate medical sensors and microcontroller, and we were to handle the *power supply and battery*. This device was a type of headset that made sensitive measurements on something in the eye (don't ask us what exactly it did, we're engineers not doctors), and would usually sit on a wall mount until the patient put it on.

This project had *tight restrictions* on board size and weight, and wasn't so tight on costs. To fit in the established form factor, we were told the entire power system and battery had to fit in a volume at least as small as 60mm x 150mm x 40mm, and weight less than 12oz. The circuit had to output a steady 5V @ 150mA from battery and mains power. These were our *general limiting factors*.

{% woodcut "power-supply.png", "translateY(-60px) skew(2deg)" %}

Power supply design is a well-established field and seems simple to many young engineers. Perfecting the output voltage and current, however, is a *more precise art* where the parameters of each component must be finely tuned. A proper battery could basically feed right into the main circuit with few intermediate steps, but if connected to wall power, a *larger circuit would be necessary*, along with hefty transformers, capacitors, and a battery charging IC that adds complexity. The allotted space was getting cramped.

At this point we *alerted the client* that the current system requirements were unrealistic and bound for failure. We explained to the CEO that in a power supply, components run large due to high current ratings, and with a battery attached it would be *astronomically expensive* to design a system to fit in their tight dimensions. So we immediately *negotiated a compromise* where they would extend the size of the power module, and most of our AC-to-DC converter circuit would live in a wall-mounted charging station, and not on the headset.

This compromise freed up their headset to be lighter and more mobile, and allowed their charging station to be *more robust*. Our final version powered the device consistenly and passed the startup's internal safety review, and went on to power an MVP *shown to investors*.

## We Can Give Your Project the Attention It Needs

{% include "components/contact.njk" %}