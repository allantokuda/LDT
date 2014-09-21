# LDT

LDT stands for "LDS Drawing Tool".

LDS stands for "Logical Data Structure" coined by Professor [John Carlis](http://www.cs.umn.edu/people/faculty/carlis).

## Overview

A *Logical Data Structure* is a way of graphically representing data.  The notation is useful for quickly documenting and understanding complex data structures.  This tool is intended to be a graphical editor for LDS, replacing pencil and paper.

## Goals
* allow LDS to be drawn and edited quickly in a digital format
* allow LDS to be edited collaboratively over the internet by many editors
* assist in teaching LDS notation to software engineering students using computer graphics

## Developers Guide
The following sections explain how to start hacking on this project.  This consists of installing some system-wide
dependencies such as ruby, node, etc (if you haven't done so already) as well as some configuration steps to get
the rails app up and running.

### Initial Dependency Setup and Installation

This section is only for those who need to setup their entire Ruby stack.

Start by installing the following:

--*The following assumes you are on a Linux distribution with `aptitude` installed*--

**rvm**

```
curl -sSL https://get.rvm.io | bash
```


**ruby (v2.1.2)**

```
sudo rvm install 2.1.2

```

**node.js**

```
sudo apt-get install nodejs
```

**postregsql**

```
sudo apt-get install postgresql
```


**node package manger (npm)**

```
sudo apt-get install npm
```

**bundler**

```
sudo gem install bundler
```

**karma**

```
npm install karma
```

**libpq-dev**

```
sudo apt-get install libpq-dev
```

### Database Setup

The following steps will create a database and user in postgresql:


First launch a `postgresql` CLI


```
sudo -u postgres psql
```

Create a database and user

```
postgres=# create database lds_dev;
postgres=# create user lds with password 'chickenfoot';
postgres=# grant all privileges on database lds_dev to lds;
postgres=# \q
```


### Bootstrapping the app

Install the required gems

```
bundle install
```

Migrate the DB

```
rake db:migrate
```

### Running the app

```
rails server
```

## Production

Check out the live [site](http://erdraw.com).