# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20121224033426) do

  create_table "entities", :force => true do |t|
    t.integer  "x"
    t.integer  "y"
    t.integer  "width"
    t.integer  "height"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
    t.string   "name"
    t.string   "attrib"
    t.integer  "graph"
    t.integer  "snapshot"
    t.integer  "local_id"
  end

  create_table "graph_snapshots", :force => true do |t|
    t.integer  "graph"
    t.integer  "local_id"
    t.string   "tag"
    t.text     "notes"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "graphs", :force => true do |t|
    t.string   "name"
    t.text     "description"
    t.string   "short_name"
    t.string   "read_password"
    t.string   "write_password"
    t.datetime "created_at",     :null => false
    t.datetime "updated_at",     :null => false
  end

  create_table "relationships", :force => true do |t|
    t.integer "graph"
    t.integer "snapshot"
    t.integer "local_id"
    t.integer "entity1"
    t.integer "entity2"
  end

end
