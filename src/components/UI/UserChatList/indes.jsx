import React from "react";
import { BuildingBlocks } from "./BuildingBlocks";
import { HorizontalFull } from "./HorizontalFull";
import { Person } from "./Person";
import * as classes from "./index.module.css";

export const Frame = () => {
    return (
        <div className={classes.frame}>
            <p className={classes.title}>
                Viendo los chats para la publicacion: #titulo
            </p>

            <div className={classes.chatContainer} data-m3-mode="green-LT">
                <div className={classes.chatItem}>
                    <BuildingBlocks className={classes.buildingBlocks} />
                    <div className={classes.chatContent}>
                        <div className={classes.iconWrapper}>
                            <Person className={classes.personIcon} color="#757575" />
                        </div>

                        <div className={classes.textContent}>
                            <div className={classes.username}>#username</div>

                            <p className={classes.supportingText}>
                                Supporting line text lorem ipsum dolor sit amet, consectetur.
                            </p>
                        </div>

                        <div className={classes.messageTime}>#messagetime</div>
                    </div>

                    <HorizontalFull className={classes.divider} divider="image.svg" />
                </div>

                <div className={classes.chatItem}>
                    <BuildingBlocks className={classes.buildingBlocks} />
                    <div className={classes.chatContent}>
                        <div className={classes.iconWrapper}>
                            <Person className={classes.personIcon} color="#757575" />
                        </div>

                        <div className={classes.textContent}>
                            <div className={classes.username}>#username</div>

                            <p className={classes.supportingText}>
                                Supporting line text lorem ipsum dolor sit amet, consectetur.
                            </p>
                        </div>

                        <div className={classes.messageTime}>#messagetime</div>
                    </div>

                    <HorizontalFull className={classes.divider} divider="divider-2.svg" />
                </div>

                <div className={classes.chatItem}>
                    <BuildingBlocks className={classes.buildingBlocks} />
                    <div className={classes.chatContent}>
                        <div className={classes.iconWrapper}>
                            <Person className={classes.personIcon} color="#757575" />
                        </div>

                        <div className={classes.textContent}>
                            <div className={classes.username}>#username</div>

                            <p className={classes.supportingText}>
                                Supporting line text lorem ipsum dolor sit amet, consectetur.
                            </p>
                        </div>

                        <div className={classes.messageTime}>#messagetime</div>
                    </div>

                    <HorizontalFull className={classes.divider} divider="divider-3.svg" />
                </div>

                <div className={classes.chatItem}>
                    <BuildingBlocks className={classes.buildingBlocks} />
                    <div className={classes.chatContent}>
                        <div className={classes.iconWrapper}>
                            <Person className={classes.personIcon} color="#757575" />
                        </div>

                        <div className={classes.textContent}>
                            <div className={classes.username}>#username</div>

                            <p className={classes.supportingText}>
                                Supporting line text lorem ipsum dolor sit amet, consectetur.
                            </p>
                        </div>

                        <div className={classes.messageTime}>#messagetime</div>
                    </div>

                    <HorizontalFull className={classes.divider} divider="divider-4.svg" />
                </div>

                <div className={classes.chatItem}>
                    <BuildingBlocks className={classes.buildingBlocks} />
                    <div className={classes.chatContent}>
                        <div className={classes.iconWrapper}>
                            <Person className={classes.personIcon} color="#757575" />
                        </div>

                        <div className={classes.textContent}>
                            <div className={classes.username}>#username</div>

                            <p className={classes.supportingText}>
                                Supporting line text lorem ipsum dolor sit amet, consectetur.
                            </p>
                        </div>

                        <div className={classes.messageTime}>#messagetime</div>
                    </div>

                    <HorizontalFull className={classes.divider} divider="divider-5.svg" />
                </div>

                <div className={classes.chatItem}>
                    <BuildingBlocks className={classes.buildingBlocks} />
                    <div className={classes.chatContent}>
                        <div className={classes.iconWrapper}>
                            <Person className={classes.personIcon} color="#757575" />
                        </div>

                        <div className={classes.textContent}>
                            <div className={classes.username}>#username</div>

                            <p className={classes.supportingText}>
                                Supporting line text lorem ipsum dolor sit amet, consectetur.
                            </p>
                        </div>

                        <div className={classes.messageTime}>#messagetime</div>
                    </div>

                    <HorizontalFull className={classes.divider} divider="divider-6.svg" />
                </div>

                <div className={classes.chatItem}>
                    <BuildingBlocks className={classes.buildingBlocks} />
                    <div className={classes.chatContent}>
                        <div className={classes.iconWrapper}>
                            <Person className={classes.personIcon} color="#757575" />
                        </div>

                        <div className={classes.textContent}>
                            <div className={classes.username}>#username</div>

                            <p className={classes.supportingText}>
                                Supporting line text lorem ipsum dolor sit amet, consectetur.
                            </p>
                        </div>

                        <div className={classes.messageTime}>#messagetime</div>
                    </div>

                    <HorizontalFull className={classes.divider} divider="divider-7.svg" />
                </div>
            </div>
        </div>
    );
};