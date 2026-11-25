---
date: 2026-11-25
author: Jake Berg
title: "On the Keeping of Gates, Part 2: The Wall Around the Phone"
description: "The app store is only the gate. The wall around it is built from an open source system emptied from the inside, carriers that hold the phone until it's paid off, glued batteries and paired parts, and bootloaders the owner may not open. What a phone ought to be instead."
image: "/blog/covers/on-the-keeping-of-gates-part-2.jpg"
---

In [the first part](/blog/on-the-keeping-of-gates) I complained about the gate: the fees, the certificates, the testers, the pictures, and the share of every sale. A gate is only useful to its keeper if there is a wall on either side of it. So in this part I walked the length of the wall, to see what it is made of and who laid each stone.

## The open one, opened and then emptied

Android was not born open. Google bought it in 2005, when it was a small company with an idea, and released its source to the world in 2008. For years that release was the best answer anyone had to Apple: an operating system that anyone could take, change, and put on a phone of their own design.

It is open still, in the letter. The source is published. But over the years, the parts of Android that people actually touch were moved, one by one, into a second layer that is not open at all. Notifications, location, maps, sign-in, the keyboard, the calendar, the store itself: these now live in Google's own services and Google's own apps, and the open versions left behind were allowed to go stale. You can build a phone from the open source today, and it will boot, and it will be missing most of what anyone means by "Android."

To have the closed layer, a phone maker signs Google's terms. For years those terms said that a maker who wanted the Play Store must also preinstall Google's search app and its browser, and must not sell phones running rival versions of Android. The European Commission fined Google more than four billion euros in 2018 over those very terms, and Europe's highest court has since let the fine stand. And in 2025 Google moved Android's day-to-day development behind its own doors, publishing the source when a release is finished rather than while it is written.

They did not close the source. They closed the room where it is written, and moved the furniture people use into a house next door that they alone hold the key to. It is still called open, the way a field is still called common after it has been fenced.

## Why no open phone has broken through

It is not for want of trying. Mozilla built Firefox OS and gave it up. Canonical built Ubuntu Touch and gave it up, and a band of volunteers keeps it alive. Purism sells the Librem 5 and Pine64 made the PinePhone, both running Linux, both admired, both used by very few. Fairphone sells a phone you can open with a screwdriver, and it runs Android, because that is what its buyers need to run.

Four stones stand in the way, and an open phone must climb all four at once.

The first is the apps. A bank, a payment app, or a streaming service may ask Google whether the phone it is running on is one Google has certified. An honest, well-built phone that Google never blessed can fail that question. GrapheneOS, a careful and security-minded build of Android, runs most banking apps now, but Google's own wallet refuses it outright. A phone that cannot open its owner's bank is a hard thing to sell to that owner.

The second is the radio. Every phone carries a second computer, the modem, which speaks to the cell towers. Its firmware is closed, it comes from a small number of chipmakers, and it sits under a thicket of patents. Even the most open phone is closed at the antenna.

The third is the carrier. Before a phone may join a network in North America it must pass certification by a body the carriers themselves founded, and then each large carrier's own tests on top of that, at the maker's expense. Selling in a carrier's store means passing still more. A carrier has every reason to be thorough with a stranger and little reason to hurry.

The fourth is scale. A giant buys its parts by the tens of millions. A small maker buys them by the thousand and pays more for each, and so must charge more for a phone that, on every other count, does less.

None of these is a law. Each is only a toll. But a newcomer must pay all of them before selling a single phone, and the giants paid theirs long ago, or own the booth.

## The carriers

One is tempted to imagine a grand alliance among the telephone companies of the world, some treaty signed in a paneled room. I know of no such treaty, and I do not think one is needed. The interests of the carriers and the phone makers run so parallel that they behave as partners without the bother of a contract. When the first iPhone arrived, it came to this country through a single carrier, by exclusive arrangement, and the habit of the thing has never quite worn off.

Consider how a phone is sold in this country. The carrier hands it over for a monthly payment spread across two or three years, and keeps it locked to its own network until the last payment is made. A thousand dollars, written as thirty a month, does not frighten anyone. The maker gets its high price. The carrier gets a customer who cannot leave without paying off the phone. The owner gets a phone, eventually.

The rules that once pried this open have been loosening, not tightening. Verizon was long required to unlock its phones sixty days after purchase. In January of this year the FCC waived that rule. Under its order, a Verizon phone may stay locked until it is paid off, and a prepaid one for a year. And a Pixel bought from Verizon arrives with its bootloader locked, while the very same phone bought from Google can be opened by its owner.

None of this is a conspiracy. It is something more durable than a conspiracy: an arrangement in which every party to it profits, and the only party not consulted is the one paying.

## What a phone ought to be

A phone ought not to cost a thousand dollars. I will not pretend to know what one costs to build. But the thousand-dollar phone is not a law of nature. It is a price people agree to because they never see it whole. Print it on the monthly bill as a single number, and watch how quickly it comes down.

A phone ought to have replaceable parts. Phones once had a back you could pop off with a thumbnail and a battery you could buy at a drugstore. Now the battery is glued in, and on an iPhone, a new battery or screen that did not come from Apple is announced to its owner as an "unknown part." That is called parts pairing, and the law has begun to notice it. Oregon banned it for devices made from 2025 onward. The European Union will require phone batteries the owner can replace, beginning in February 2027, with an exemption for batteries durable enough to outlast the need, and I expect the makers will walk through that exemption in a body.

A phone ought to be programmable down to the kernel. It is a computer, and its owner ought to be able to run on it whatever they please, with a warning if the warning is honest. Google, to its credit, lets the owner of a Pixel bought unlocked open its bootloader and install another system entirely. Apple has never permitted it. I own an iPhone I would like to run my own kernel on, and the only door in is [an exploit](/blog/jailbreaking-an-iphone-11-on-ios-15). That is a strange thing to need for a machine I paid for in full.

And a phone's battery ought not to have an expiration date. I will be careful here, because care is owed. No one stamps a date into a battery. Lithium wears out on its own, by chemistry, and no law will repeal that. But a battery that wears out and cannot be replaced is an expiration date for the whole phone, whatever the engineers call it. In 2017 Apple acknowledged that it had been slowing older iPhones whose batteries had worn, to keep them from shutting off without warning. It may well have been the right engineering. But the owners were not told, and an owner who is not told the battery is tired can only conclude the phone is. Apple apologized, cut the price of a new battery for a year, and later agreed to pay up to five hundred million dollars to settle the lawsuit that followed, admitting nothing.

## What I would ask, again

The asks from the first part stand. To them I would add four more.

Sell the phone unlocked, at a price printed plainly, and unlock it the day it is paid for without the owner having to ask.

Let the battery and the screen come out with a screwdriver, and let any part that fits, work.

Give every phone a way to unlock its bootloader, behind whatever warnings honesty requires, and let the owner decide.

Let a bank trust a phone because it is secure, not because one company has certified it.

Thoreau built his cabin with a borrowed axe, and he wrote that he returned it sharper than he received it. I am not asking for anything so fine as that. I would settle for an axe I am allowed to sharpen.
