import Button from "@mui/material/Button";
import React from "react";
import {ProjectDeleteRequest, ProjectEditRequest, ProjectOpenRequest, ProjectPostRequest, ProjectService } from "../common/services/ProjectService";

export default function LoadingSpinner() {

       // Testo Button click
       const TestButtonCreateClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
              event.preventDefault();

              // CREATE
              var service = new ProjectService()
              var input2 = new ProjectPostRequest();
              input2.id = "My little project"
              input2.key = "KEY"
              input2.path = "/Users/nikolasdiesl/Projects/Clicker/test.clicker"  //"C:/data/test.clicker"

              var result = await service.create(input2)

              // jwt = result.data.jwt;
              console.log("CREATE", result);
       }

       // Testo Button click
       const TestButtonOpenClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
              event.preventDefault();

              var service = new ProjectService()

              var input = new ProjectOpenRequest()
              input.key = "KEY"
              input.path = "C:/data/test.clicker"

              // OPEN
              var result = await service.open(input);

              // jwt = result.data.jwt;
              console.log("OPEN", result);
       }

       // Testo Button click
       const TestButtonEditClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
              event.preventDefault();

              var service = new ProjectService()

              // EDIT
              var input = new ProjectEditRequest();
              input.id = "KEY"
              input.author = "Nikolas Diesl"
              input.version = "a0.64"

              // service.token = jwt;
              var result = await service.edit(input);
              console.log('EDIT', result);

       }

       // Testo Button click
       const TestButtonDeleteClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
              event.preventDefault();

              var service = new ProjectService()
              var input = new ProjectDeleteRequest();

              // service.token = jwt;
              await service.delete(input);
       }
       
    return (
       <>
           <h1>Project</h1>
           <Button onClick={TestButtonCreateClick}>Test Create</Button>
           <Button onClick={TestButtonOpenClick}>Test Open</Button>
           <Button onClick={TestButtonEditClick}>Test Edit</Button>
           <Button onClick={TestButtonDeleteClick}>Test Delete</Button>

           <h1>Module</h1>
           <Button onClick={TestButtonCreateClick}>Test Create</Button>
           <Button onClick={TestButtonOpenClick}>Test Detail</Button>
           <Button onClick={TestButtonEditClick}>Test Edit</Button>
           <Button onClick={TestButtonDeleteClick}>Test Delete</Button>

           <h1>Script</h1>
           <Button onClick={TestButtonCreateClick}>Test Create</Button>
           <Button onClick={TestButtonOpenClick}>Test Detail</Button>
           <Button onClick={TestButtonEditClick}>Test Edit</Button>
           <Button onClick={TestButtonDeleteClick}>Test Delete</Button>

           <h1>Settings</h1>
           <Button onClick={TestButtonCreateClick}>Test Create</Button>
           <Button onClick={TestButtonOpenClick}>Test Detail</Button>
           <Button onClick={TestButtonEditClick}>Test Edit</Button>
           <Button onClick={TestButtonDeleteClick}>Test Delete</Button>

           <h1>Global Settings</h1>
           <Button onClick={TestButtonCreateClick}>Test Create</Button>
           <Button onClick={TestButtonOpenClick}>Test Detail</Button>
           <Button onClick={TestButtonEditClick}>Test Edit</Button>
           <Button onClick={TestButtonDeleteClick}>Test Delete</Button>
       </>
    );
}