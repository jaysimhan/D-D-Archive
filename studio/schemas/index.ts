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
import homepage from './homepage'

// New imports
import ruleset from './ruleset'
import magicSchool from './magicSchool'
import weaponProperty from './weaponProperty'
import weaponMastery from './weaponMastery'
import feature from './feature'
import species from './species'
import character from './character'
import campaign from './campaign'
import { featureGrant } from './objects/featureGrant'

export const schemaTypes = [
    race,
    classType,
    subclass,
    spell,
    item,
    trait,
    homepage,
    // Objects
    proficiencyRule,
    spellGrant,
    featureGrant,
    feat,
    background,
    monster,
    // New schemas
    ruleset,
    magicSchool,
    weaponProperty,
    weaponMastery,
    feature,
    species,
    character,
    campaign,
]
