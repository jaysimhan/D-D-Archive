import { withEditionVariants } from './common/editionVariants'
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
import sharedSheet from './sharedSheet'

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
    withEditionVariants(race),
    withEditionVariants(classType),
    withEditionVariants(subclass),
    withEditionVariants(spell),
    withEditionVariants(item),
    withEditionVariants(trait),
    homepage,
    sharedSheet,
    // Objects
    proficiencyRule,
    spellGrant,
    featureGrant,
    withEditionVariants(feat),
    withEditionVariants(background),
    monster,
    // New schemas
    ruleset,
    magicSchool,
    weaponProperty,
    weaponMastery,
    withEditionVariants(feature),
    withEditionVariants(species),
    character,
    campaign,
]
