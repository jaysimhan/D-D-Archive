import race from './race'
import classType from './class'
import subclass from './subclass'
import spell from './spell'
import item from './item'
import feat from './feat'
import background from './background'
import monster from './monster'
import trait from './trait'
import { proficiencyRule, spellGrant } from './objects/rules'


export const schemaTypes = [
    race,
    classType,
    subclass,
    spell,
    item,
    trait,
    // Objects
    proficiencyRule,
    spellGrant,
    feat,
    background,
    monster,
]

