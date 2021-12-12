#! /usr/bin/env node

import { Barrelsby } from './';
import { getArgs } from './args';

Barrelsby(getArgs().argv as any);
