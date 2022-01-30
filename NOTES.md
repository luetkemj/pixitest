Deploy: https://github.com/withastro/snowpack/discussions/2419
`npm run build`
in build/index.html
change <script type="module" src="./src/index.js"></script>
to <script type="module" src="https://luetkemj.github.io/pixitest/src/index.js"></script>
`npm run deploy`

FPS:
~30fps at start of dev

zIndex:
10: ground
20: items/props
30: actors
40: sky

https://www.reddit.com/r/dndnext/comments/exikfx/homebrew_my_take_on_an_rpglike_inventory_slot/

## INVENTORY

Goal:

- Items in pack take time to grab so it behooves you to put things in your belt you need in a pinch (weapons, potions, scrolls) and things that you can take your time to retrieve in the backpack.

MVP:

- Backpack to hold inventory
- Ability to select items
- Drop
- wield/wear/quaff/eat/etc
- show description

V2:

- Move items from backpack to belt
- Weight on all items
- Ability to throw backpack
- Removing backpack should reduce encumberance in battle
- Using items in pack requires in game time where the game ticks on for as long as is required
- Getting items from backpack requires in game time where the game ticks on - can be interrupted. So not useful to try and grab something during a fight - should look instead to your belt
- Money has weight
- Will need to find a way to get vast sums of gold back to civilization where you can actually make use of it...

## LIGHTING

Lighting...
give entities a light component.
do a first pass lighting of all light sources on map
only recalc for lightsources that have moved
player has full map fov but only things that are lit should be visible.
what to do about discovered tiles...
lighting should play a part in if a player is spotted by a monster or not.
remembered tiles can be navigated in pitchblack
undiscovered can be navigated but you won't discover new things

Lumens component
a number that describes the output of a lightsources

Lux component
a number that describes the ambient light of a location

store lighting in a locId map
locId: { sources: [eid...], lux: n }

just do the damn thing and worry about perfing later.

Fuckit. Just light the whole damn map every damn time. Only calculating the alpha. See how that goes. perf later.

## EFFECTS

effects array in meta that stores eids and their relevant components.

```
[
  {
    eid: torchEid
    components: ['Lighting']
  }
]
```

on addEffect
Add the component with params

on removeEffect
Remove component

AFFECT / EFFECT
Affects and Effects map one to one. Every entity has the same list of Effects (unless they are immune to something) but affects are the things an entity does to another.

Affects on an entity denote what it can do to another Entity
Effects on an entity denote what

Looks to Effects array and

```
Affects: {
  affectName: {
    duration: 1 // n turns that effect takes place
    componentName: { ...props }
  }
}

Effects: {
  effectName: {
    duration: 1 // n turns that effect takes place
  }
}
```

burning

resistance: burning

durability: 100

entropy system

- check for burning items (reduce durability)
- check for decaying items
- check age of food items etc
- check age of player etc
