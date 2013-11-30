# LDT

LDT stands for "LDS Drawing Tool".

LDS stands for "Logical Data Structure" coined by Professor [John Carlis](http://www.cs.umn.edu/people/faculty/carlis).

## Overview

A *Logical Data Structure* is a way of graphically representing data.  The notation is useful for quickly documenting and understanding complex data structures.  This tool is intended to be a graphical editor for LDS, replacing pencil and paper.

## Goals
* allow LDS to be drawn and edited quickly in a digital format
* allow LDS to be edited collaboratively over the internet by many editors
* assist in teaching LDS notation to software engineering students using computer graphics

## Installation
* install rvm 1.19 or later, node.js, and PostgreSQL

```
rvm install `cat .ruby-version`
gem install bundler
bundle install
npm install karma
createdb lds_dev
createuser -DPRS lds  #password in config/database.yml
rake db:migrate
rails server
```

