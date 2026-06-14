import 'dotenv/config';
import { prisma } from '../src/lib/db';
import { Difficulty, TagType } from '@prisma/client';

const companies = ['Google', 'Amazon', 'Microsoft', 'Adobe', 'Meta'];
const types = ['Logic', 'Math', 'Lateral Thinking', 'Estimation', 'Pattern Recognition'];

const problemsData = [
  {
    number: 1,
    title: 'The Bridge at Midnight',
    slug: 'the-bridge-at-midnight',
    difficulty: Difficulty.MEDIUM,
    isPremium: false,
    statement: `Four travelers need to cross a rickety bridge at night. The bridge is in such poor condition that it can support at most two people at a time. Because it is pitch black, they must carry a single flashlight to guide their way. Every group crossing the bridge, whether one or two people, must travel at the speed of the slowest person.

The four travelers walk at different speeds: Alice takes 1 minute to cross, Bob takes 2 minutes, Charlie takes 5 minutes, and Daniel takes 10 minutes.

What is the absolute minimum time required for all four travelers to cross to the other side?`,
    answer: 'The minimum time required is 17 minutes by sending the two fastest travelers first, having the fastest return, and then sending the two slowest travelers together.',
    editorial: `To solve this riddle, we must avoid the common temptation of always sending the fastest traveler (Alice) back and forth. If we always send Alice back, the total time would be: Bob+Alice + Charlie+Alice + Daniel+Alice = 2 + 1 + 5 + 1 + 10 = 19 minutes.

Instead, we can save time by having the two slowest travelers (Charlie and Daniel) cross the bridge together, so their times overlap. However, this means we need someone else already on the other side to bring the flashlight back.

Here is the optimal sequence:
1. Alice (1m) and Bob (2m) cross first. (Time elapsed: 2 minutes)
2. Alice (1m) returns with the flashlight. (Time elapsed: 3 minutes)
3. Charlie (5m) and Daniel (10m) cross together. (Time elapsed: 13 minutes)
4. Bob (2m) returns with the flashlight. (Time elapsed: 15 minutes)
5. Alice (1m) and Bob (2m) cross together again. (Time elapsed: 17 minutes)

Thus, the minimum total time is 17 minutes.`,
    tags: ['Google', 'Amazon', 'Logic'],
  },
  {
    number: 2,
    title: 'Burning Ropes of Time',
    slug: 'burning-ropes-of-time',
    difficulty: Difficulty.EASY,
    isPremium: false,
    statement: `You are given two ropes of uneven density and a box of matches. Each rope takes exactly 60 minutes (1 hour) to burn completely from one end to the other.

Because the ropes have uneven density, they do not burn at a constant rate. For example, half of a rope might burn in 10 minutes while the remaining half takes 50 minutes. You cannot cut the ropes or measure them by length.

How can you use these ropes to measure exactly 45 minutes?`,
    answer: 'Light the first rope at both ends and the second rope at one end. When the first rope finishes burning (30 mins), light the other end of the second rope to measure another 15 minutes.',
    editorial: `Since each rope burns for exactly 60 minutes, lighting a rope from both ends simultaneously will cause it to burn completely in exactly half the time, which is 30 minutes, regardless of its density distribution.

To measure exactly 45 minutes:
1. Start by lighting Rope A at both ends, and Rope B at only one end.
2. Rope A will burn out completely in exactly 30 minutes. At this exact moment, Rope B has been burning for 30 minutes, meaning it has exactly 30 minutes of burn time remaining.
3. The moment Rope A goes out, light the other end of Rope B. Because Rope B is now burning from both ends, its remaining 30 minutes of burn time will be cut in half, taking exactly 15 minutes to burn out completely.

The total time elapsed from the beginning until Rope B completely burns out is 30 minutes + 15 minutes = 45 minutes.`,
    tags: ['Microsoft', 'Math', 'Lateral Thinking'],
  },
  {
    number: 3,
    title: 'The Three Light Switches',
    slug: 'the-three-light-switches',
    difficulty: Difficulty.EASY,
    isPremium: false,
    statement: `You are standing in a hallway outside a closed room. On the wall next to the door are three light switches, labeled 1, 2, and 3. Inside the room, there is a single incandescent light bulb.

You cannot see into the room from the hallway. You are allowed to flip the switches in any combination and leave them in any position you want. However, you can only enter the room once to inspect the light bulb.

How can you determine with absolute certainty which switch controls the light bulb?`,
    answer: 'Turn Switch 1 on for 10 minutes, turn it off, turn Switch 2 on, and enter the room; the bulb will be on (Switch 2), off and hot (Switch 1), or off and cold (Switch 3).',
    editorial: `This riddle requires thinking beyond just the visual state of the bulb (on or off) and utilizing physical properties like temperature.

Here is the step-by-step strategy:
1. Turn Switch 1 ON and leave it on for about 10 minutes. This gives the bulb enough time to heat up.
2. After 10 minutes, turn Switch 1 OFF and immediately turn Switch 2 ON. Leave Switch 3 OFF.
3. Open the door and enter the room.

Now, inspect the light bulb:
- If the light bulb is ON, it must be controlled by Switch 2 (since it's the only one currently on).
- If the light bulb is OFF, touch it carefully:
  - If the bulb is HOT to the touch, it must be controlled by Switch 1 (which was on for 10 minutes and just turned off).
  - If the bulb is COLD to the touch, it must be controlled by Switch 3 (which was never turned on).`,
    tags: ['Google', 'Adobe', 'Lateral Thinking'],
  },
  {
    number: 4,
    title: 'Heavy Gold Gold coins',
    slug: 'heavy-gold-coins',
    difficulty: Difficulty.MEDIUM,
    isPremium: false,
    statement: `You are given 10 bags of gold coins. Nine of the bags contain genuine gold coins, each weighing exactly 10 grams. One bag, however, contains counterfeit coins, each weighing exactly 9 grams.

You have a digital weighing scale that shows the exact weight of whatever is placed on it. You want to identify the counterfeit bag.

What is the minimum number of weighings required on the digital scale to find the counterfeit bag?`,
    answer: 'You only need exactly 1 weighing by taking a progressive number of coins (1 from bag 1, 2 from bag 2, etc.) and checking the total weight deficit.',
    editorial: `The solution uses a progressive sampling technique, allowing us to pinpoint the counterfeit bag in a single weighing.

Label the bags from 1 to 10. Take coins from each bag as follows:
- 1 coin from Bag 1
- 2 coins from Bag 2
- 3 coins from Bag 3
- ...
- 10 coins from Bag 10

In total, you will have 1 + 2 + 3 + ... + 10 = 55 coins. Place all 55 coins on the scale at once.

If all coins were genuine (10g each), the scale would read exactly 550 grams. However, since the counterfeit coins weigh 9 grams (a deficit of 1 gram per coin), the total weight will be less than 550 grams.
The deficit will tell us exactly which bag is counterfeit:
- A deficit of 1 gram (549g total) means Bag 1 is counterfeit (since we took 1 coin from it).
- A deficit of 2 grams (548g total) means Bag 2 is counterfeit.
- A deficit of N grams means Bag N is counterfeit.`,
    tags: ['Amazon', 'Math', 'Logic'],
  },
  {
    number: 5,
    title: 'The Lily Pad Exponential Pond',
    slug: 'the-lily-pad-exponential-pond',
    difficulty: Difficulty.EASY,
    isPremium: false,
    statement: `In a quiet lake, a single lily pad is growing. Every day, the size of the lily pad doubles in area. 

If it takes exactly 48 days for the lily pad to completely cover the entire surface of the lake, how many days does it take for the lily pad to cover exactly half of the lake?`,
    answer: 'It takes 47 days because the lily pad doubles in size every day, so it must have covered half the lake on the day before it covered the whole lake.',
    editorial: `This riddle highlights the counter-intuitive nature of exponential growth. People often think the answer is 24 days (half of 48), but that assumes linear growth.

Let's work backward from day 48:
- On Day 48, the lake is 100% covered.
- Since the lily pad doubles in size every day, it must have been half as large on the previous day.
- Therefore, on Day 47, the lake was exactly 50% (half) covered.

Going back one more step, it was 25% covered on Day 46, and so on.`,
    tags: ['Meta', 'Math', 'Pattern Recognition'],
  },
  {
    number: 6,
    title: 'The Monty Hall Dilemma',
    slug: 'the-monty-hall-dilemma',
    difficulty: Difficulty.MEDIUM,
    isPremium: true,
    statement: `You are a contestant on a game show. The host presents you with three closed doors. Behind one door is a brand new sports car; behind the other two are goats.

You choose a door—say, Door 1. The host, who knows what is behind each door, opens one of the other doors—say, Door 3—revealing a goat. He then asks you: "Would you like to switch your choice to Door 2?"

Is it to your advantage to switch your choice, or does it not matter?`,
    answer: 'Yes, you should always switch. Switching gives you a 2/3 chance of winning the car, while sticking with your initial choice keeps your odds at 1/3.',
    editorial: `This is the famous Monty Hall problem. At first glance, it seems that with two closed doors remaining, the probability must be 50-50. However, this is incorrect because the host's action is not random.

Let's break down the probabilities:
1. When you first choose Door 1, there is a 1/3 chance you selected the car, and a 2/3 chance the car is behind one of the other two doors (Door 2 or Door 3).
2. The host MUST open a door with a goat. By doing so, he consolidates the entire 2/3 probability of the "other doors" group into the single remaining unopened door (Door 2).
3. If you stick with Door 1, you win only if you were right initially (1/3 chance).
4. If you switch to Door 2, you win if you were wrong initially (2/3 chance).

Therefore, switching doubles your chances of winning from 1/3 to 2/3.`,
    tags: ['Meta', 'Logic', 'Math'],
  },
  {
    number: 7,
    title: 'Measuring Water with Pitchers',
    slug: 'measuring-water-with-pitchers',
    difficulty: Difficulty.MEDIUM,
    isPremium: true,
    statement: `You are standing next to a water tap and have two empty pitchers: one that holds exactly 5 liters of water, and another that holds exactly 3 liters.

The pitchers do not have any markings on them, so you cannot estimate fractional amounts.

How can you measure out exactly 4 liters of water using only these two pitchers?`,
    answer: 'Fill the 5-liter pitcher, pour into the 3-liter pitcher until full (leaving 2L), empty the 3-liter pitcher, transfer the 2L, fill the 5-liter pitcher again, and pour into the 3-liter pitcher until full (leaving exactly 4L).',
    editorial: `We can solve this puzzle by performing a sequence of fills, transfers, and drains.

Here is the step-by-step solution:
1. Fill the 5-liter pitcher completely.
2. Pour water from the 5-liter pitcher into the 3-liter pitcher until the 3-liter pitcher is full. You now have exactly 2 liters left in the 5-liter pitcher.
3. Empty the 3-liter pitcher.
4. Pour the 2 liters of water from the 5-liter pitcher into the 3-liter pitcher. The 3-liter pitcher now contains 2 liters, leaving room for exactly 1 more liter.
5. Fill the 5-liter pitcher completely again.
6. Pour water from the 5-liter pitcher into the 3-liter pitcher until it is full. Since the 3-liter pitcher already had 2 liters, it will take exactly 1 liter from the 5-liter pitcher.

This leaves exactly 4 liters of water in the 5-liter pitcher.`,
    tags: ['Amazon', 'Math', 'Logic'],
  },
  {
    number: 8,
    title: 'The Poisoned Wine Bottles',
    slug: 'the-poisoned-wine-bottles',
    difficulty: Difficulty.HARD,
    isPremium: true,
    statement: `A king has 1,000 bottles of wine. An assassin poisons exactly one bottle. The poison is extremely deadly and has no taste or smell, but it takes exactly 24 hours to take effect.

The king wants to find the poisoned bottle before a royal banquet in 24 hours. He has a group of prisoners whom he can use as taste testers.

What is the minimum number of prisoners required to identify the single poisoned bottle within 24 hours?`,
    answer: 'You need exactly 10 prisoners by labeling bottles in binary (10 bits) and having each prisoner drink from bottles where their assigned bit is 1.',
    editorial: `The problem can be solved using binary representation. Since 2^10 = 1024, which is greater than 1000, we can uniquely represent each bottle using a 10-digit binary number.

Here is the setup:
1. Label the 1000 bottles from 1 to 1000. Express each label as a 10-bit binary number (e.g., Bottle 1 is 0000000001, Bottle 1000 is 1111101000).
2. Label the 10 prisoners from 1 to 10, corresponding to the 10 bit positions (from least significant to most significant).
3. For each bottle, a prisoner drinks a drop of wine from it if and only if the bit at their corresponding position in the bottle's binary label is 1. For example, Prisoner 1 drinks from all odd-numbered bottles.
4. Wait 24 hours.

To find the poisoned bottle, look at which prisoners die. If Prisoner 1 and Prisoner 3 die, the poisoned bottle's binary representation has 1s in positions 1 and 3, which is 0000000101 (Bottle 5). By converting the survival pattern back to decimal, the king can pinpoint the exact bottle.`,
    tags: ['Google', 'Math', 'Logic'],
  },
  {
    number: 9,
    title: 'The Two Sand Hourglasses',
    slug: 'the-two-sand-hourglasses',
    difficulty: Difficulty.MEDIUM,
    isPremium: false,
    statement: `You need to boil an egg for exactly 9 minutes, but you do not have a clock or watch. 

Instead, you have two hourglasses: one that measures exactly 4 minutes, and another that measures exactly 7 minutes.

How can you measure exactly 9 minutes using only these two hourglasses?`,
    answer: 'Start both. Flip the 4-minute one when it empties. When the 7-minute one empties (at 7 mins), start the egg. When the 4-minute one empties again (at 8 mins), flip it to get the final 1 minute.',
    editorial: `We can measure exactly 9 minutes by managing the remaining sand in the hourglasses.

Here is the sequence of steps:
1. Start both the 4-minute and 7-minute hourglasses running simultaneously.
2. When the 4-minute hourglass runs out (at 4 minutes), flip it over immediately. The 7-minute hourglass now has 3 minutes of sand left.
3. When the 7-minute hourglass runs out (at 7 minutes), start boiling the egg immediately. The 4-minute hourglass (which was flipped at minute 4) now has exactly 1 minute of sand left.
4. When the 4-minute hourglass runs out (at 8 minutes), the egg has been boiling for 1 minute. Immediately flip the 4-minute hourglass over again.
5. When the 4-minute hourglass runs out this time (at 12 minutes total, 9 minutes since the egg started), stop boiling the egg.

The egg has now boiled for exactly 1 + 8 = 9 minutes (from minute 7 to minute 16). Alternatively, here is another common method:
Start both. When 4-min runs out (at 4m), flip it. When 7-min runs out (at 7m), the 4-min hourglass has 1 min left. Flip the 7-min hourglass immediately. When the 1 min in the 4-min hourglass runs out (at 8m), the 7-min hourglass has 1 min of sand at the bottom. Flip it back to run that 1 min. Total time 9 mins.`,
    tags: ['Adobe', 'Logic', 'Lateral Thinking'],
  },
  {
    number: 10,
    title: 'The Infinite Hallway of Lockers',
    slug: 'the-infinite-hallway-of-lockers',
    difficulty: Difficulty.HARD,
    isPremium: false,
    statement: `A school hallway contains 100 closed lockers, numbered 1 to 100. 

A student walks down the hall and opens every locker. A second student walks down and closes every second locker (2, 4, 6, ...). A third student changes the state of every third locker (3, 6, 9, ...), opening it if it was closed, and closing it if it was open. This process continues until 100 students have walked down the hallway.

After the 100th student finishes, which lockers will remain open?`,
    answer: 'Only the perfect square lockers (1, 4, 9, 16, 25, 36, 49, 64, 81, 100) will remain open because they have an odd number of factors.',
    editorial: `A locker's state changes every time its number is a multiple of the student's number. This means Locker N is toggled by Student D if and only if D is a divisor (factor) of N.

All lockers start closed. A locker will end up OPEN if it is toggled an odd number of times, and CLOSED if it is toggled an even number of times.

Thus, the question reduces to: Which numbers between 1 and 100 have an odd number of factors?
Factors usually come in pairs (for example, the factors of 12 are 1 & 12, 2 & 6, 3 & 4). The only way a number can have an odd number of factors is if one factor pairs with itself (e.g., 4 * 4 = 16).
These are the perfect squares. Their factors are:
- 1: 1 (1 factor - odd)
- 4: 1, 2, 4 (3 factors - odd)
- 9: 1, 3, 9 (3 factors - odd)
- 16: 1, 2, 4, 8, 16 (5 factors - odd)

Therefore, the lockers that remain open are the perfect squares: 1, 4, 9, 16, 25, 36, 49, 64, 81, and 100.`,
    tags: ['Microsoft', 'Math', 'Pattern Recognition'],
  },
  {
    number: 11,
    title: 'Ferrying Animals Across the River',
    slug: 'ferrying-animals-across-the-river',
    difficulty: Difficulty.EASY,
    isPremium: false,
    statement: `A farmer is returning from the market with a wolf, a goat, and a head of cabbage. He must cross a river, but his small boat can only hold himself and one of the three items at a time.

If left unattended, the wolf will eat the goat, and the goat will eat the cabbage. The farmer must safely transport all three to the other side of the river.

How can the farmer accomplish this task?`,
    answer: 'Take the goat first, return empty, take the wolf, return with the goat, take the cabbage, return empty, and finally take the goat across.',
    editorial: `This is a classic state-space search puzzle where we must avoid leaving the wolf with the goat, or the goat with the cabbage.

Here is the step-by-step ferry plan:
1. The farmer takes the goat across the river, leaving the wolf and cabbage together (safe).
2. The farmer returns alone.
3. The farmer takes the wolf across.
4. To prevent the wolf from eating the goat, the farmer brings the goat back to the starting side.
5. The farmer takes the cabbage across, leaving the goat behind. The cabbage is now safely on the other side with the wolf (safe).
6. The farmer returns alone.
7. The farmer takes the goat across one last time.

All three items are now safely on the other side.`,
    tags: ['Meta', 'Logic', 'Lateral Thinking'],
  },
  {
    number: 12,
    title: 'Estimating Piano Tuners in Chicago',
    slug: 'estimating-piano-tuners-in-chicago',
    difficulty: Difficulty.HARD,
    isPremium: true,
    statement: `How many piano tuners are there in the city of Chicago? 

This is a classic Fermi estimation problem, popular in engineering and product management interviews to test structured thinking under extreme ambiguity. You are not given any data.

How would you structure a logical estimation to arrive at a reasonable order-of-magnitude estimate?`,
    answer: 'Estimate about 225-290 piano tuners by calculating the total hours of piano tuning needed annually in Chicago and dividing by the working hours of a single tuner.',
    editorial: `This is the famous Fermi question. We can solve it by breaking the estimation down into logical sub-components:

1. **Population of Chicago**: Estimate about 3 million people (or 2.7M actual).
2. **Pianos per Household**: Assume 1 in 100 households owns a piano (or 1 in 20 households, but let's adjust for institutions like schools and churches). Let's estimate 1 piano per 20 households, with average household size of 2.5. This gives 3,000,000 / 2.5 = 1,200,000 households. At 2%, we have 24,000 pianos in households, plus another 6,000 in schools/churches = ~30,000 pianos total.
3. **Tuning Frequency**: Assume a piano needs tuning once a year. That means 30,000 piano tunings are needed per year.
4. **Tuner Capacity**: A piano tuner works 5 days a week, tunes 2 pianos a day (including travel), and works 50 weeks a year.
   Annual tunings per tuner = 50 * 5 * 2 = 500 tunings.
5. **Number of Tuners**: Divide total tunings by capacity: 30,000 / 500 = 60 tuners.

Depending on your assumptions (e.g. higher household piano percentage), the answer typically ranges between 50 and 300. The interviewer cares about your breakdown and arithmetic structure, not the exact number.`,
    tags: ['Google', 'Estimation', 'Logic'],
  },
  {
    number: 13,
    title: 'The Outbreak of Blue Eyes',
    slug: 'the-outbreak-of-blue-eyes',
    difficulty: Difficulty.HARD,
    isPremium: true,
    statement: `An island contains 100 people. Some have blue eyes, and the rest have brown eyes. They all live under a strict religious law: if anyone discovers they have blue eyes, they must leave the island at noon the next day.

No one is allowed to speak of eye color, and there are no mirrors or reflective surfaces. Everyone knows everyone else's eye color but not their own.

One day, a visitor arrives and announces to everyone: "At least one of you has blue eyes."

Assuming everyone is perfectly logical, what happens next?`,
    answer: 'If there are N blue-eyed people, they will all leave the island together on the N-th day after the announcement.',
    editorial: `This riddle uses mathematical induction and common knowledge.

Let's analyze the problem for different numbers of blue-eyed people (N):
- **Case N = 1**: If there is only 1 blue-eyed person, they look around, see only brown-eyed people, and realize they must be the one. They leave on the 1st day.
- **Case N = 2**: If there are 2 blue-eyed people (A and B), A sees B's blue eyes and B sees A's blue eyes. On Day 1, no one leaves (since A thinks B might be the only one, and B thinks A might be). On Day 2, when A sees B didn't leave, A realizes B must have seen someone else's blue eyes (A's own). Thus, both realize they have blue eyes and leave together on Day 2.
- **Induction**: If there are N blue-eyed people, no one leaves for the first N-1 days. On the N-th day, they all realize that if there were only N-1 blue-eyed people, they would have left on day N-1. Since they didn't, all N blue-eyed people realize they themselves must have blue eyes, and they all leave at noon on the N-th day.

If there are, say, 15 blue-eyed people, they will all leave on the 15th day.`,
    tags: ['Meta', 'Logic', 'Lateral Thinking'],
  },
  {
    number: 14,
    title: 'The Burning Desert Crossing',
    slug: 'the-burning-desert-crossing',
    difficulty: Difficulty.MEDIUM,
    isPremium: false,
    statement: `A desert explorer needs to cross a desert that takes exactly 6 days to walk. 

The explorer can carry at most 4 days' worth of food and water. He can hire friendly porters to carry supplies for him, but each porter can also carry at most 4 days' worth of supplies for themselves.

What is the minimum number of porters the explorer must hire to successfully cross the desert, assuming everyone must survive and return safely?`,
    answer: 'The explorer needs to hire exactly 2 porters, with one returning on day 1 and the other returning on day 2.',
    editorial: `This is a resource allocation puzzle. We must manage supplies so that the explorer makes it across, while the porters have enough food to walk out and return home safely.

Let's coordinate the journey with 2 porters (Porter A and Porter B):
- **Day 1**: The explorer, Porter A, and Porter B start with 4 days of food each (12 days total).
  At the end of Day 1, they have consumed 3 days of food (9 remaining). Porter A gives 1 day of food to the explorer and 1 day to Porter B. Porter A keeps 1 day of food, which is exactly enough to walk back to the start.
  *Status at start of Day 2*: Explorer has 4 days, Porter B has 4 days, Porter A is walking home.
- **Day 2**: Explorer and Porter B walk further. At the end of Day 2, they consume 2 days of food (6 remaining). Porter B gives 1 day of food to the explorer. Porter B keeps 2 days of food, which is exactly enough to walk back to the start (2 days away).
  *Status at start of Day 3*: Explorer has 4 days of food and is 2 days into the desert.
- **Days 3 to 6**: The explorer walks the remaining 4 days alone, consuming his 4 days of food and arriving safely at the other side.

Everyone survives, and the explorer successfully crosses using only 2 porters.`,
    tags: ['Amazon', 'Logic', 'Estimation'],
  },
  {
    number: 15,
    title: 'The Patterns in the Sequence',
    slug: 'the-patterns-in-the-sequence',
    difficulty: Difficulty.EASY,
    isPremium: false,
    statement: `Look closely at the following sequence of numbers:

1, 11, 21, 1211, 111221, 312211, ...

What is the next number in this sequence, and what is the underlying logic that generates it?`,
    answer: 'The next number is 13112221. The sequence is the Look-and-Say sequence, where each term describes the digits of the previous term.',
    editorial: `This is the famous Look-and-Say sequence, discovered by mathematician John Conway. Each term is generated by "reading" the digits of the previous term.

Let's walk through it:
- **1** is read as "one 1" → **11**
- **11** is read as "two 1s" → **21**
- **21** is read as "one 2, one 1" → **1211**
- **1211** is read as "one 1, one 2, two 1s" → **111221**
- **111221** is read as "three 1s, one 2, two 1s" → **312211**
- **312211** is read as "one 3, one 1, two 2s, two 1s" → **13112221**

Therefore, the next number is 13112221.`,
    tags: ['Adobe', 'Pattern Recognition', 'Math'],
  },
];

async function main() {
  console.log('Clearing database tables...');
  await prisma.problemsOnTags.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.problem.deleteMany();

  console.log('Seeding tags...');
  const tagMap = new Map<string, string>();

  for (const name of companies) {
    const tag = await prisma.tag.create({
      data: {
        name,
        type: TagType.COMPANY,
      },
    });
    tagMap.set(name, tag.id);
  }

  for (const name of types) {
    const tag = await prisma.tag.create({
      data: {
        name,
        type: TagType.TYPE,
      },
    });
    tagMap.set(name, tag.id);
  }

  console.log('Seeding 15 problems...');
  for (const data of problemsData) {
    const { tags, ...problemFields } = data;
    
    // Ensure slug starts with "number-" prefix to match SEO conventions
    const prefix = `${problemFields.number}-`;
    if (!problemFields.slug.startsWith(prefix)) {
      problemFields.slug = `${prefix}${problemFields.slug}`;
    }

    const problem = await prisma.problem.create({
      data: {
        ...problemFields,
      },
    });

    for (const tagName of tags) {
      const tagId = tagMap.get(tagName);
      if (tagId) {
        await prisma.problemsOnTags.create({
          data: {
            problemId: problem.id,
            tagId,
          },
        });
      }
    }
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
