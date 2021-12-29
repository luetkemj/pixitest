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

RUBBER DUCKING:
Ok some assistance as I'm trying to wrap my head around saving and loading and when to use multiple worlds.

Ok, so I have a roguelike I've been slowly building with bitecs for several months now. It's pretty basic. A single dungeon level. Some goblins. You can pick up swords and health potions and kill the goblins. Not much more than that.

I'm at the point where I would like to delve deeper into the dungeon. Should I create a new world for each level of the dungeon? Conceptually that has been my approach with other ecs systems in the past. Maybe I'm over thinking things but with my current architecture a player can collect items (all their own entities) that would need to come with to the next level. Do I need write some logic to collect all the entities I care about so I can serialize them and then unserialize them into the other world? What happens then after the player continues on level 2 for a bit and then goes back to level 1? Serialize again and overwrite the entities in the first world?

I have a meta object that I use to store strings related to entities in. It's indexed by id. But ids are reused across worlds so my meta object can't rely on ids like it is...

Should give the worlds ids? Then do a lookup in the meta object my world_id.entity_id?

It's just not clear to me how solve the saving and loading problem within the ecs architecture as it is. I figure I must be approaching it wrong but there isn't really a clear example that I could find.

So a clear usecase:

A large game is broken up into chunks. Each chunk is stored in it's own world. How do I manage migrating a player entity with n associated entities (items in inventory) across chunks? What's a reasonable strategy for saving a game with multiple worlds?

Maybe I should just be using one giant world? If that's the case what do I do if it gets too big? I think the default limit is 100000 entities? I can see myself reaching that pretty quickly. My single dungeon level has almost 4000 entities already and my game is super simple. Complicate things a bit, add a dozen or so levels and I'm maxed out...

I felt like things were going really smoothly with this game and now I'm feeling lost again. Trying hard not to start over again. I'll just hit this wall again eventually.

---

After some thought:

On migrating entities across worlds - write a script to get all entities crossing over (all body parts, all inventory items, etc) serialize them. deserialize in the other world. go.

Enitities count up. See how far we get before hitting a limit? If they always count up we shouldn't have any conflicts...

alternate solution - store different entitity groups in different worlds to avoid conflicts.

---

After some more thought - store worlds in an indexed array. LocId contains the world id (index) as well. Then we need to store pipelines bases in a similary index array so they can be created with the correct world. From there systems need to concat the entities they care about before working on them.

But honestly - this is solving a problem I still don't have... so keeping it in my back pocket for now.
